export interface IEducation {
    educationId: number;
    educationName: string;
    hasSpecialization: boolean;
}

export interface ISpecialization {
    specializationId: number;
    educationId: number;
    specializationName: string;
}