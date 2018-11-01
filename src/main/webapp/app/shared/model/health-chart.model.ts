import { IPatient } from 'app/shared/model//patient.model';

export interface IHealthChart {
    id?: number;
    height?: number;
    weight?: number;
    diagnosis?: string;
    treatment?: string;
    patient?: IPatient;
}

export class HealthChart implements IHealthChart {
    constructor(
        public id?: number,
        public height?: number,
        public weight?: number,
        public diagnosis?: string,
        public treatment?: string,
        public patient?: IPatient
    ) {}
}
