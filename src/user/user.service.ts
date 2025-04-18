import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestWithCookies } from 'src/auth/interfaces/auth.interface';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async signUp(dto: RegisterDTO) {
    const hashed = await bcrypt.hash(dto.password, 12);
    try {
      // PrismaClientを型付きでDIしているので、
      // Next.js単体の時より型チェックが厳しくなる
      await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hashed,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return {
        message: 'ok',
      };
    } catch (error) {
      // Prismaの操作に伴うエラーコードは、PrismaClientの
      // PrismaClientKnownRequestErrorで宣言されている
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('This email is already taken');
        }
      }
      throw error;
    }
  }

  async getUser(request: RequestWithCookies) {
    const token = request.user?.id;
    if (!token) {
      return {
        message: 'ok',
        id: '',
      };
    }

    const userInfo = await this.prisma.user.findFirst({
      where: {
        id: token,
      },
    });
    if (!userInfo) {
      throw new NotFoundException('ユーザーが見つかりませんでした');
    }
    return userInfo;
  }

  async patchUser(dto: RegisterDTO, request: RequestWithCookies) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: request.user?.id,
      },
    });
    if (!user) {
      return new ForbiddenException('ユーザーが存在しません');
    }
    const { name, email, password } = dto;

    const hashedPassword = await bcrypt.hash(password, 12);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    return {
      message: 'ok',
    };
  }

  async deleteUser(request: RequestWithCookies, response: Response) {
    await this.prisma.user.delete({
      where: {
        id: request.user?.id,
      },
    });

    // JWTなどが入っているcookie名に応じて削除
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
    return {
      message: 'ok',
    };
  }
}
