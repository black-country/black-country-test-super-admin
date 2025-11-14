export function formatAmenities(str: string): string {
    return str.split('_').map((word, index) => {
        return index === 0
            ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            : word.charAt(0).toLowerCase() + word.slice(1).toLowerCase();
    }).join(' ');
}