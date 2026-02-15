import { ObjectId } from 'mongodb';

export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF' | 'INSPECTOR' | 'CUSTOMER';

// D1: User Database
export interface UserGroup {
    _id?: ObjectId;
    name: string;
    permissions: string[]; // e.g., ['VEHICLES_VIEW', 'VEHICLES_EDIT', 'POLICIES_APPROVE']
    createdAt: Date;
}

export interface User {
    _id?: ObjectId;
    username: string;
    password?: string; // Hashed
    name: string;
    role: UserRole;
    groupId?: ObjectId;
    createdAt: Date;
}

// D2: Driver Database
export interface Driver {
    _id?: ObjectId;
    name: string;
    licenseNumber: string;
    contact: string;
    assignedVehicles: ObjectId[];
}

// D3: Vehicle Database
export type ImportStatus = 'PORT' | 'BORDER' | 'HOME';

export interface Vehicle {
    _id?: ObjectId;
    make: string;
    model: string;
    chassisNumber: string;
    engineNumber: string;
    color: string;
    engineCapacity: string;
    ownerName: string;
    ownerDetails: string;
    importRoute: string;
    currentStatus: ImportStatus;
    createdAt: Date;
    updatedAt: Date;
}

// D4: Inspection Database
export interface Inspection {
    _id?: ObjectId;
    vehicleId: ObjectId;
    inspectorId: ObjectId;
    date: Date;
    location: string;
    conditionReport: string;
    isComplete: boolean;
    notes?: string;
}

// D5: Policy Database
export type PolicyStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export interface InsurancePolicy {
    _id?: ObjectId;
    vehicleId: ObjectId;
    policyNumber: string;
    coverageDetails: string;
    amount: number;
    status: PolicyStatus;
    managerId?: ObjectId; // For approval
}

// D6: Claims Database
export interface Claim {
    _id?: ObjectId;
    policyId: ObjectId;
    customerId: ObjectId;
    incidentDescription: string;
    convictionsRecord?: string; // D5/D6 requirement: 'Convictions' info
    dateOfIncident: Date;
    claimedAmount: number;
    approvedAmount?: number;
    status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
}

// D7: Reports Database
export interface SystemReport {
    _id?: ObjectId;
    reportType: 'VEHICLE_SUMMARY' | 'INSPECTION_STATS' | 'FINANCIAL_CLAIMS';
    generatedBy: ObjectId;
    data: any; // Dynamic JSON data
    createdAt: Date;
}
