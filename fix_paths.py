import re

with open('portfolioindex.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace image paths: src="./sunset.jpeg" -> src="Portfolio/sunset.jpeg"
html = re.sub(r'src="\./(sunset|durgamaa|flower|pot_PM|bonds)\.jpeg"', r'src="Portfolio/\1.jpeg"', html)
html = html.replace('src="./20260630_134632.jpg"', 'src="Portfolio/20260630_134632.jpg"')

# Replace other relative links
html = html.replace('href="blog.html"', 'href="Portfolio/blog.html"')
html = html.replace('href="Profile_260228_210701.pdf"', 'href="Portfolio/Profile_260228_210701.pdf"')

with open('../index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated ../index.html successfully!")
