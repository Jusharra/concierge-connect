"""One-off copy sweep: rewrites public copy that contradicted the deposit model
(jets, yachts and exotic cars: reserve with a deposit, balance paid to the operator).
Properties and business acquisitions keep their own wording. Kept in the repo for the record."""
import re, sys

def sub_once(path, old, new):
    s = open(path, encoding="utf-8").read()
    assert old in s, (path, old[:60])
    open(path, "w", encoding="utf-8").write(s.replace(old, new, 1))

def faq(question_regex, new_answer):
    p = "src/pages/FAQPage.tsx"
    s = open(p, encoding="utf-8").read()
    pat = re.compile(r"(question:\s*(?:`|\")" + question_regex + r"(?:`|\"),\s*answer:\s*)(?:`[^`]*`|\"(?:[^\"\\]|\\.)*\"),", re.S)
    m = pat.search(s)
    assert m, question_regex
    s = s[: m.start()] + m.group(1) + new_answer + "," + s[m.end():]
    open(p, "w", encoding="utf-8").write(s)

faq(r"What is \$\{SITE_NAME\}\?",
    "`${SITE_NAME} lets you book private jet charter, yacht charter and exotic car rental with vetted operators, and request private introductions for luxury properties and business acquisitions. Choose a package and reserve with a deposit, or request a quote for a custom trip.`")
faq(r"Is \$\{SITE_NAME\} a marketplace or booking platform\?",
    "\"For private jets, yachts and exotic cars you can reserve online with a deposit or request a quote. The aircraft, vessels and vehicles are owned and operated by independent operators, and the operator confirms availability for your dates. Properties and business acquisitions are handled by private introduction, and those transactions occur directly between the parties.\"")
faq(r"How do I request access to a service\?",
    "`Browse our offerings, choose a category and city, then reserve a package with a deposit or request a quote. For properties and business acquisitions, complete the inquiry form and a ${SITE_NAME} representative will contact you within 24 hours.`")
faq(r"What happens after I submit an inquiry\?",
    "\"For jets, yachts and exotic cars: if you reserve, you pay a deposit and the operator confirms your trip; if you request a quote, we return with confirmed pricing and options and send a secure payment link for the deposit if you would like to proceed. The remaining balance is paid directly to the operator. For properties and business acquisitions: we review your inquiry, reach out to understand your needs and arrange a private introduction, then you work directly with the other party to finalize details.\"")
faq(r"How do payments work\?",
    "`For jets, yachts and exotic cars, you pay a deposit online when you reserve; the deposit is our booking fee and is shown before you pay. The remaining balance is paid directly to the operator when you meet. Prices shown are starting-at figures and the final price is confirmed before you pay. Properties and business acquisitions are transacted directly between the parties, and ${SITE_NAME} does not take payment for them.`")
faq(r"Does \$\{SITE_NAME\} charge a fee for its services\?",
    "\"The deposit you pay when you reserve a jet, yacht or exotic car is our booking fee, and it is shown before you pay. The rest of the price is paid to the operator. For properties and business acquisitions, terms are explained before you commit.\"")
faq(r"What is your refund policy\?",
    "\"Each package states its refund terms before you pay, and you acknowledge them at checkout. Cancellation terms for the remaining balance are set by the operator and shared with you before you commit.\"")
faq(r"Are there deposits required\?",
    "\"Reserving a jet, yacht or exotic car takes a deposit, shown on the package before you pay. The remaining balance is paid directly to the operator. Property transactions follow standard real estate practices, and any financial requirements are explained in your conversation with our team.\"")

p = "src/pages/FAQPage.tsx"
sub_once(p, "While transactions occur directly between you and the partner, we value your experience.",
            "Although the remaining balance is paid directly to the operator, we value your experience.")
sub_once(p, "How long does the coordination process take?", "How long does it take?")
sub_once(p, "The complete coordination timeline depends", "The complete timeline depends")

h = "src/components/home/HeroSection.tsx"
sub_once(h, "Private air, elite yachts, exotic vehicles, and off-market properties — coordinated discreetly through verified partners.",
            "Book private jets, yachts and exotic cars, or request a quote. Off-market properties and business acquisitions by private introduction.")
sub_once(h, "Jet charter and helicopter coordination arranged city-specifically with licensed operators.",
            "Jet and helicopter charter city by city with licensed operators. Book online or request a quote.")
sub_once(h, "Day charters and superyacht access are coordinated directly with captains and management firms.",
            "Day charters and superyacht charters with professional captains and crews. Book online or request a quote.")
sub_once(h, "From Lamborghinis to vintage Porsches — curated access arranged through trusted partners in select cities.",
            "From Lamborghinis to vintage Porsches, available in select cities. Book online or request a quote.")

sub_once("src/components/home/HowItWorksSection.tsx", 'title: "Partner Coordination",', 'title: "Confirmation",')
sub_once("src/components/home/HowItWorksSection.tsx", "We connect you with our verified partners who match your specific requirements.",
         "Availability and pricing are confirmed with the operator or partner for your dates.")
sub_once("src/components/home/HowItWorksSection.tsx", "Enjoy your curated experience with ongoing concierge support throughout.",
         "Enjoy your experience with support from our team throughout.")

a = "src/pages/AccessPage.tsx"
sub_once(a, "Curated luxury experiences coordinated discreetly through our network of verified partners.",
            "Book private jets, yachts and exotic cars, or request a quote, with verified operators.")
sub_once(a, '{ step: "03", title: "Coordination", description: "We connect you with verified partners" },',
            '{ step: "03", title: "Confirmation", description: "Availability and pricing are confirmed with the operator" },')

sub_once("src/components/layout/Footer.tsx", "No Booking Fees", "Transparent Starting Prices")
print("copy sweep ok")
