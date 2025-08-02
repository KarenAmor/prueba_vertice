import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createSupabaseClient } from '../config/supabase.config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private supabase;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.supabase = createSupabaseClient(this.configService);
  }

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // Convertir email a minúsculas para consistencia
    const emailLowerCase = email.toLowerCase();

    // Verificar si el usuario ya existe en la tabla users
    const { data: existingUser } = await this.supabase
      .from('users')
      .select('id')
      .eq('email', emailLowerCase)
      .single();

    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }

    // Registrar usuario en el sistema de autenticación de Supabase
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email: emailLowerCase,
      password: password,
    });

    if (authError || !authData.user) {
      throw new ConflictException('Error al registrar usuario en el sistema de autenticación');
    }

    // Crear el usuario en la tabla users de la base de datos (sin contraseña, ya que Supabase la maneja)
    const { data: user, error } = await this.supabase
      .from('users')
      .insert([{ 
        id: authData.user.id,
        email: emailLowerCase 
      }])
      .select()
      .single();

    if (error) {
      throw new ConflictException('Error al crear el usuario en la base de datos');
    }

    // Generar token JWT
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    console.log(`[LOGIN DEBUG] Intentando login para email: ${email}`);

    // Convertir email a minúsculas para compatibilidad
    const emailLowerCase = email.toLowerCase();

    // Buscar el usuario en la tabla users para verificar que existe
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', emailLowerCase)
      .single();

    console.log(`[LOGIN DEBUG] Usuario encontrado:`, user);
    console.log(`[LOGIN DEBUG] Error de búsqueda:`, error);

    if (error || !user) {
      console.log(`[LOGIN DEBUG] Usuario no encontrado o error en búsqueda`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Usar la API de autenticación de Supabase para verificar credenciales
    // (Ahora todos los usuarios están en el sistema de autenticación de Supabase)
    console.log(`[LOGIN DEBUG] Usando autenticación de Supabase para verificar credenciales`);
    
    const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
      email: emailLowerCase,
      password: password,
    });

    console.log(`[LOGIN DEBUG] Respuesta de autenticación Supabase:`, authData);
    console.log(`[LOGIN DEBUG] Error de autenticación Supabase:`, authError);

    if (authError || !authData.user) {
      console.log(`[LOGIN DEBUG] Autenticación de Supabase falló`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token JWT
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    console.log(`[LOGIN DEBUG] Login exitoso para usuario:`, user.email);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async validateUser(userId: string) {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('id, email')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return null;
    }

    return user;
  }
}
