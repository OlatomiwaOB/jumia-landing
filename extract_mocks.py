import re

with open('themes/traditional-taste/page.tsx', 'r') as f:
    lines = f.readlines()

# Extract lines from 95 to 341
mock_lines = lines[95:342]

# Prepare the new file mocked-products.ts
new_file_content = """import { ProductProps } from '@/types';

export const getMockedProducts = (baseProduct: any) => {
    let showcaseProducts: any[] = [];
    
"""

for line in mock_lines:
    # Replace references to showcaseProducts[0] or allProducts[0] with baseProduct
    line = line.replace('showcaseProducts[0]', 'baseProduct')
    line = line.replace('allProducts[0] || {}', 'baseProduct')
    line = line.replace('const page2BaseProduct = { ...baseProduct, code: undefined };', 'const page2BaseProduct = { ...baseProduct, code: undefined };')
    
    # We want to remove the if (currentPage === X) checks and just accumulate all products
    if 'if (currentPage' in line:
        continue
    
    # Let's just accumulate everything
    new_file_content += line

new_file_content += """
    return showcaseProducts;
};
"""

# Let's do it smarter.
# Actually, the logic in page.tsx re-assigns `showcaseProducts` in each if block, which overrides it.
# We want to just push all of them into one large array and return it.
