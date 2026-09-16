// GET /api/users?search=...
// Matches fullName, email, or userId. Never returns the current user
// (you don't invite yourself) or passwords.
export const searchUsers = (req, res, next) => {
    try {
        const { search } = req.query;
        const currentUserId = req.user;

        let results = users.filter(user => user.userId !== currentUserId);

        if (search === '') return res.status(200).json({
            message: "Users fetched successfully",
            success: true,
            users: null
        });

        if (search) {
            const term = search.toLowerCase();
            results = results.filter(user =>
                user.fullName.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term) ||
                user.userId.toLowerCase().includes(term)
            );
        }

        res.status(200).json({
            message: "Users fetched successfully",
            success: true,
            users: results.map(sanitizeUser)
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/users/recent
// "Recent teammates" = people who already share a project with you — a simple,
// real-data-backed stand-in for a full activity feed, useful for quick-adding
// to a new invitation.
export const getRecentTeammates = (req, res, next) => {
    try {
        const currentUserId = req.user;

        const sharedProjects = projects.filter(project => project.members.includes(currentUserId));

        const teammateIds = new Set();
        sharedProjects.forEach(project => {
            project.members.forEach(memberId => {
                if (memberId !== currentUserId) teammateIds.add(memberId);
            });
        });

        const teammates = users
            .filter(user => teammateIds.has(user.userId))
            .slice(0, 10)
            .map(sanitizeUser);

        res.status(200).json({
            message: "Recent teammates fetched successfully",
            success: true,
            users: teammates
        });
    } catch (err) {
        next(err);
    }
};
