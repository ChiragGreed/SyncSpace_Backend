// Shared across controllers that return user data — never send a password back to the client.
export const sanitizeUser = (user) => {
    const { password, ...safeUser } = user;
    console.log(user);
    return safeUser;
};
