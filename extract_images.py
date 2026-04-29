import fitz
import os

pdf_file = "EduLearning.pdf"
output_dir = "public/images/extracted"

os.makedirs(output_dir, exist_ok=True)

doc = fitz.open(pdf_file)
img_count = 0

for page_index in range(len(doc)):
    page = doc[page_index]
    image_list = page.get_images()
    for image_index, img in enumerate(image_list, start=1):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        image_filename = f"{output_dir}/page{page_index+1}_img{image_index}.{image_ext}"
        with open(image_filename, "wb") as f:
            f.write(image_bytes)
        img_count += 1

print(f"Extracted {img_count} images.")
