import { ConfigService } from '@nestjs/config';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksService {
    private configService;
    private supabase;
    constructor(configService: ConfigService);
    create(createTaskDto: CreateTaskDto, userId: string): Promise<any>;
    findByProject(projectId: string, userId: string): Promise<any>;
    findOne(id: string, userId: string): Promise<any>;
    update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<any>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
