/**
 * PDF Export Utility
 * Uses browser's native print-to-PDF for maximum reliability
 * This avoids CSS parsing issues and supports all modern CSS features
 */

/**
 * Export showcase to PDF using browser's native print dialog
 * This is the most reliable method as it uses the browser's own rendering engine
 *
 * @param projectName - Name of the project for display in instructions
 */
export const exportShowcaseToPDF = (projectName: string): void => {
  // First, scroll to top to ensure proper rendering
  const showcaseContainer = document.getElementById("showcase-container");
  if (showcaseContainer) {
    // Scroll the dialog to top
    const dialog = showcaseContainer.closest(".overflow-y-auto");
    if (dialog) {
      dialog.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }

  // Show instructions to user
  const instructions = [
    `📄 Exporting: ${projectName}`,
    "",
    "Steps:",
    "1. Print dialog will open",
    "2. Select 'Save as PDF' as destination",
    "3. Adjust settings if needed:",
    "   - Layout: Portrait",
    "   - Pages: All",
    "   - Background graphics: ON",
    "4. Click 'Save' to download",
    "",
    "✨ All pages and content will be included!",
  ].join("\n");

  alert(instructions);

  // Small delay to ensure scroll completes
  setTimeout(() => {
    printShowcaseToPDF();
  }, 100);
};

/**
 * Opens browser's print dialog for PDF export
 * Automatically hides UI elements that shouldn't be in the PDF
 */
export const printShowcaseToPDF = (): void => {
  // The print dialog will open and user can save as PDF
  // All styling is handled via @media print in globals.css
  window.print();
};

/**
 * Legacy export function kept for backwards compatibility
 * Redirects to print-based export
 */
export const exportToPDF = async (
  elementId: string,
  filename: string = "export.pdf",
): Promise<void> => {
  console.log(`Exporting ${elementId} as ${filename} using print method`);
  printShowcaseToPDF();
};
