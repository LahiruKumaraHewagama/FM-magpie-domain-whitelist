export { };

// Create a type for the roles
export type Roles = "super_admin" | "admin" | "moderator";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    };
  }
}