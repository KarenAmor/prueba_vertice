"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const supabase_config_1 = require("../config/supabase.config");
let AuthService = class AuthService {
    jwtService;
    configService;
    supabase;
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.supabase = (0, supabase_config_1.createSupabaseClient)(this.configService);
    }
    async register(registerDto) {
        const { email, password } = registerDto;
        const emailLowerCase = email.toLowerCase();
        const { data: existingUser } = await this.supabase
            .from('users')
            .select('id')
            .eq('email', emailLowerCase)
            .single();
        if (existingUser) {
            throw new common_1.ConflictException('El usuario ya existe');
        }
        const { data: authData, error: authError } = await this.supabase.auth.signUp({
            email: emailLowerCase,
            password: password,
        });
        if (authError || !authData.user) {
            throw new common_1.ConflictException('Error al registrar usuario en el sistema de autenticación');
        }
        const { data: user, error } = await this.supabase
            .from('users')
            .insert([{
                id: authData.user.id,
                email: emailLowerCase
            }])
            .select()
            .single();
        if (error) {
            throw new common_1.ConflictException('Error al crear el usuario en la base de datos');
        }
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
    async login(loginDto) {
        const { email, password } = loginDto;
        const emailLowerCase = email.toLowerCase();
        const { data: user, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('email', emailLowerCase)
            .single();
        if (error || !user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
            email: emailLowerCase,
            password: password,
        });
        if (authError || !authData.user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
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
    async validateUser(userId) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map