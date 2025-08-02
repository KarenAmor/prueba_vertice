import { ConfigService } from '@nestjs/config';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsService {
    private configService;
    private supabase;
    constructor(configService: ConfigService);
    create(createProjectDto: CreateProjectDto, userId: string): Promise<any>;
    findAll(userId: string): Promise<any>;
    findOne(id: string, userId: string): Promise<any>;
    update(id: string, updateProjectDto: UpdateProjectDto, userId: string): Promise<any>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
