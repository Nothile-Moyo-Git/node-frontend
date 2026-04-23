/**
 * Date created: 23/04/2026
 *
 * Description: Image loading using vite's import meta glob. The file is mts to ensure that we're returning ESM and not commonjs
 *
 * Author: Nothile
 */

// Images all our images through vite
const images = import.meta.glob("../images/**/*", { eager: true });

// Handle our file imports and extract the image details
export const loadImage = (fileName: string, fileLastUpdated: string): string => {
  const path = `../images${fileLastUpdated ? `/${fileLastUpdated}` : ""}/${fileName}`;

  // Might need to be optional, needs testing without a fileName being present
  const module = images[path] as { default: string };

  return module.default;
};
