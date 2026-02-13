
export class Anonymizer {
    // Regex patterns for PII
    // Email: specific enough to catch emails but avoid false positives
    static emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

    // Phone: Matches various formats like (123) 456-7890, 123-456-7890, +1 123 456 7890
    static phoneRegex = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g;

    // Credit Card: Simple heuristic for 13-19 digits, maybe separated by spaces/dashes
    // We'll use a safer check to avoid masking random long numbers unless they look like cards
    static creditCardRegex = /\b(?:\d[ -]*?){13,16}\b/g;

    static mask(text: string): string {
        if (!text) return text;
        let masked = text;

        // Mask Emails
        masked = masked.replace(Anonymizer.emailRegex, (match) => {
            const parts = match.split('@');
            // distinct masking: j***@g***.com
            const name = parts[0];
            const domain = parts[1];
            return `${name.substring(0, 1)}***@${domain.substring(0, 1)}***${domain.substring(domain.lastIndexOf('.'))}`;
        });

        // Mask Phones
        masked = masked.replace(Anonymizer.phoneRegex, "###-###-####");

        // Mask Credit Cards (if plausible)
        masked = masked.replace(Anonymizer.creditCardRegex, "****-****-****-****");

        return masked;
    }

    static processDataset(data: string[][]): string[][] {
        return data.map(row => row.map(cell => Anonymizer.mask(cell)));
    }
}
