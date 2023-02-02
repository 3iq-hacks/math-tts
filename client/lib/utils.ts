export type ForceNull<T> = { [K in keyof T]: null };
export type PickNull<T, K extends keyof T> = { [P in K]: null };
export type ForceNonNull<T> = { [K in keyof T]: NonNullable<T[K]> };
export type PickNonNull<T, K extends keyof T> = { [P in K]: NonNullable<T[P]> };

export type PickNullables<T, NonNullables extends keyof T, Nullables extends keyof T> = PickNull<T, Nullables> & PickNonNull<T, NonNullables>;

export const fileValid = (file: File, allowedTypes: string[]): boolean => {
    if (!file) {
        return false;
    }
    if (!allowedTypes.includes(file.type)) {
        return false;
    }
    return true;
}
