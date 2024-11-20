import os
import json
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import HtmlFormatter

# Directory paths
CODES_DIR = "./codes/"
OUTPUT_DIR = "./web_projects/"
PROJECTS_JSON = "./projects.json"

# Ensure output directory exists
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def load_projects_json():
    """Load existing projects.json or return an empty structure."""
    if os.path.exists(PROJECTS_JSON):
        with open(PROJECTS_JSON, "r") as file:
            return json.load(file)
    return {"projects": []}

def save_projects_json(data):
    """Save the updated projects.json file."""
    with open(PROJECTS_JSON, "w") as file:
        json.dump(data, file, indent=4)

def generate_html_from_code(filename, code, language):
    """Generate syntax-highlighted HTML for a given code snippet."""
    lexer = get_lexer_by_name(language, stripall=True)
    formatter = HtmlFormatter(full=True, style="monokai")
    return highlight(code, lexer, formatter)

def update_projects():
    """Process code files and update projects.json."""
    projects_data = load_projects_json()
    existing_files = {proj["code_url"] for proj in projects_data["projects"]}

    for code_file in os.listdir(CODES_DIR):
        file_path = os.path.join(CODES_DIR, code_file)
        if os.path.isfile(file_path):
            file_extension = code_file.split(".")[-1]
            language_map = {"py": "python", "js": "javascript", "html": "html"}
            language = language_map.get(file_extension)

            if language and file_path not in existing_files:
                with open(file_path, "r") as file:
                    code_content = file.read()

                # Generate HTML for syntax highlighting
                highlighted_html = generate_html_from_code(code_file, code_content, language)

                # Save the highlighted HTML
                output_html_path = os.path.join(OUTPUT_DIR, f"{code_file}.html")
                with open(output_html_path, "w") as output_file:
                    output_file.write(highlighted_html)

                # Update projects.json with metadata
                projects_data["projects"].append({
                    "title": f"Project: {code_file}",
                    "description": f"Auto-generated project for {code_file}",
                    "link": f"https://github.com/yourusername/{code_file}",
                    "code_url": f"{file_path}",
                    "language": language
                })

    save_projects_json(projects_data)
    print("Projects JSON and HTML files updated successfully.")

if __name__ == "__main__":
    update_projects()
