import re
from html import unescape


class Preprocessing:
    HTML_TAG_PATTERN = re.compile(r"<[^>]*>")

    @staticmethod
    def sanitize_text(value: str, *, required: bool = False) -> str:
        """Normalize user-supplied plain text."""
        if not isinstance(value, str):
            if required:
                raise ValueError("A text value is required.")
            return ""

        value = unescape(value)
        value = Preprocessing.HTML_TAG_PATTERN.sub("", value)
        value = value.replace("\x00", "").strip()

        if required and not value:
            raise ValueError("This field cannot be empty.")

        return value

    @classmethod
    def sanitize_ticket_data(cls, data: dict) -> dict:
        """Normalize permitted ticket input fields."""
        cleaned = data.copy()

        if "title" in cleaned:
            cleaned["title"] = cls.sanitize_text(
                cleaned["title"],
                required=True,
            )

        if "description" in cleaned:
            cleaned["description"] = cls.sanitize_text(
                cleaned["description"]
            )

        return cleaned