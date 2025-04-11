/**
 * Utility functions for text formatting
 */

/**
 * Function to normalize excessive line breaks in text
 * Replaces 3 or more consecutive line breaks with 2
 * 
 * @param text Text to normalize
 * @returns Normalized text
 */
export function normalizeNewlines(text: string): string {
    // Replace 3 or more consecutive line breaks with 2
    return text.replace(/\n{3,}/g, '\n\n');
}

/**
 * Function to truncate text according to Discord embed field limitations
 * 
 * @param text Text to truncate
 * @param maxLength Maximum length (default: 1024)
 * @returns Text limited to the specified length
 */
export function truncateText(text: string, maxLength: number = 1024): string {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength - 3) + "...";
}

/**
 * Function to truncate text according to Discord embed title limitations
 * 
 * @param text Text to truncate
 * @param maxLength Maximum length (default: 250)
 * @returns Text limited to the specified length
 */
export function truncateTitle(text: string, maxLength: number = 250): string {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength - 3) + "...";
} 