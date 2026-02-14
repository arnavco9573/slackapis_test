export const TASK_CHAINS = {
    wl_onboarding: [
        'registration_request',
        'slack_onboarding',
        'assign_market_portal',
    ],
};

/**
 * Get the next task category in a chain
 * @param currentCategory - Current task category
 * @returns Next task category in chain, or null if no next task
 */
export function getNextTaskInChain(currentCategory: string): string | null {
    for (const chain of Object.values(TASK_CHAINS)) {
        const currentIndex = chain.indexOf(currentCategory);
        if (currentIndex !== -1 && currentIndex < chain.length - 1) {
            return chain[currentIndex + 1];
        }
    }
    return null;
}

/**
 * Check if a task category is part of a chain
 * @param category - Task category to check
 * @returns True if task is part of a chain
 */
export function isChainTask(category: string): boolean {
    return Object.values(TASK_CHAINS).some((chain) =>
        chain.includes(category)
    );
}

/**
 * Get the chain name for a task category
 * @param category - Task category
 * @returns Chain name or null if not in a chain
 */
export function getChainName(category: string): string | null {
    for (const [chainName, chain] of Object.entries(TASK_CHAINS)) {
        if (chain.includes(category)) {
            return chainName;
        }
    }
    return null;
}
