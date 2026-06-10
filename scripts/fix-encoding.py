from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BAD = "\ufffd?"


def fix_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8", errors="replace")
    orig = text

    literals = [
        (
            f'<div class="why-item__icon">{BAD}/div><div><h3>Licensed Professionals</h3>',
            '<div class="why-item__icon">&#9989;</div><div><h3>Licensed Professionals</h3>',
        ),
        (
            f'<div class="why-item__icon">{BAD}/div><div><h3>Fast Response Times</h3>',
            '<div class="why-item__icon">&#9889;</div><div><h3>Fast Response Times</h3>',
        ),
        (
            '<div class="testimonial-stars" aria-label="5 out of 5 stars">????' + BAD + '/div>',
            '<div class="testimonial-stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>',
        ),
        (
            f'<span class="hero__trust-item">{BAD}Georgia Licensed Contractor</span>',
            '<span class="hero__trust-item">&#10003; Georgia Licensed Contractor</span>',
        ),
        (
            f'<span class="hero__trust-item">{BAD}Insurance Friendly</span>',
            '<span class="hero__trust-item">&#10003; Insurance Friendly</span>',
        ),
        (
            f'<span class="hero__trust-item">{BAD}Locally Owned</span>',
            '<span class="hero__trust-item">&#10003; Locally Owned</span>',
        ),
        ("restoration " + BAD + "we guide", "restoration &mdash; we guide"),
        ("Don't wait " + BAD + "water", "Don't wait &mdash; water"),
        ("Google Maps Embed " + BAD + "Replace", "Google Maps Embed &mdash; Replace"),
        ('testimonial-author">' + BAD + "Sarah", 'testimonial-author">&mdash; Sarah'),
        ('testimonial-author">' + BAD + "James", 'testimonial-author">&mdash; James'),
        ('testimonial-author">' + BAD + "Linda", 'testimonial-author">&mdash; Linda'),
        ("LLC " + BAD + "a Georgia", "LLC &mdash; a Georgia"),
        ("professionals " + BAD + "locally", "professionals &mdash; locally"),
        ("stressful " + BAD + "that's", "stressful &mdash; that's"),
        ("contractor " + BAD + "you're", "contractor &mdash; you're"),
        ("24" + BAD + "48 hours", "24&ndash;48 hours"),
        ("24" + BAD + "8 hours", "24&ndash;48 hours"),
        ("Metro Atlanta " + BAD + "from mitigation", "Metro Atlanta &mdash; from mitigation"),
        ("process " + BAD + "from emergency", "process &mdash; from emergency"),
        ("gallery " + BAD + "water damage", "gallery &mdash; water damage"),
        ("558-5151</a> " + BAD + "Available", "558-5151</a> &mdash; Available"),
        ("0" + BAD + "5 Minutes", "0&ndash;5 Minutes"),
        ("1" + BAD + " Hours", "1&ndash;2 Hours"),
        ("Days 2" + BAD + ":", "Days 2&ndash;7:"),
        ("Don't Wait " + BAD + "Call Now", "Don't Wait &mdash; Call Now"),
        ("Metro Atlanta " + BAD + "Duluth", "Metro Atlanta &mdash; Duluth"),
        ("8AM" + BAD + "PM", "8AM&ndash;6PM"),
        ("Call Now " + BAD + "Don't Wait", "Call Now &mdash; Don't Wait"),
    ]

    for old, new in literals:
        text = text.replace(old, new)

    if text != orig:
        path.write_text(text, encoding="utf-8", newline="\r\n")
        return True
    return False


def main() -> None:
    for path in sorted(ROOT.glob("*.html")):
        changed = fix_file(path)
        print(("fixed:" if changed else "ok:"), path.name)


if __name__ == "__main__":
    main()
