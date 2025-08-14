// Export all services
export { authService, default as AuthService } from './authService';
export { canisterService, default as CanisterService } from './canisterService';

// Export types
export type { UserSession, AuthConfig, AuthResult, Role } from './authService';

export type { CanisterConfig, Actors, CanisterIds } from './canisterService';
