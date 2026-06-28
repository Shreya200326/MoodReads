"""
Seed 100 books into the MoodReads database.
Run: python seed_data.py (from the backend/ directory with venv active)
"""
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, engine, Base
from app.models import Book

Base.metadata.create_all(bind=engine)

BOOKS = [
    # ── Fantasy ──────────────────────────────────────────────────────────────
    {"title": "The Name of the Wind", "author": "Patrick Rothfuss", "genre": "Fantasy", "year": 2007, "pages": 662, "isbn": "9780756404741", "description": "A legendary figure recounts his extraordinary life as a musician, magician, and hero.", "mood_tags": ["Dreamy", "Adventurous", "Motivated"], "cover_url": ""},
    {"title": "Six of Crows", "author": "Leigh Bardugo", "genre": "Fantasy", "year": 2015, "pages": 465, "isbn": "9781627792127", "description": "Criminal prodigy Kaz Brekker assembles a crew of dangerous outcasts for a heist that could make them rich beyond their wildest dreams.", "mood_tags": ["Adventurous", "Thrilling", "Motivated"], "cover_url": ""},
    {"title": "The Way of Kings", "author": "Brandon Sanderson", "genre": "Fantasy", "year": 2010, "pages": 1007, "isbn": "9780765326355", "description": "An epic tale of war, betrayal, and destiny on a world ravaged by highstorms.", "mood_tags": ["Adventurous", "Motivated", "Thrilling"], "cover_url": ""},
    {"title": "A Court of Thorns and Roses", "author": "Sarah J. Maas", "genre": "Fantasy", "year": 2015, "pages": 419, "isbn": "9781619634442", "description": "A huntress is taken to a dangerous, magical land after killing a wolf in the woods.", "mood_tags": ["Romantic", "Adventurous", "Dreamy"], "cover_url": ""},
    {"title": "The Final Empire", "author": "Brandon Sanderson", "genre": "Fantasy", "year": 2006, "pages": 541, "isbn": "9780765311788", "description": "A crew of rebels plans to overthrow the immortal Lord Ruler in a world covered in ash.", "mood_tags": ["Adventurous", "Motivated", "Thrilling"], "cover_url": ""},
    {"title": "The Lies of Locke Lamora", "author": "Scott Lynch", "genre": "Fantasy", "year": 2006, "pages": 499, "isbn": "9780553588941", "description": "A gang of con artists operate in a Venice-inspired city of criminals and nobility.", "mood_tags": ["Adventurous", "Thrilling", "Happy"], "cover_url": ""},
    {"title": "Shadow and Bone", "author": "Leigh Bardugo", "genre": "Fantasy", "year": 2012, "pages": 358, "isbn": "9780805094596", "description": "An orphan discovers a power that could change the fate of her war-torn world.", "mood_tags": ["Dreamy", "Romantic", "Adventurous"], "cover_url": ""},
    {"title": "The Starless Sea", "author": "Erin Morgenstern", "genre": "Fantasy", "year": 2019, "pages": 498, "isbn": "9780385541213", "description": "A graduate student discovers a mysterious book that leads him to an underground world.", "mood_tags": ["Dreamy", "Mystery", "Peaceful"], "cover_url": ""},
    {"title": "Circe", "author": "Madeline Miller", "genre": "Fantasy", "year": 2018, "pages": 393, "isbn": "9780316556347", "description": "The mythological sorceress Circe discovers her powers and forges her own path among gods and mortals.", "mood_tags": ["Motivated", "Dreamy", "Peaceful"], "cover_url": ""},
    {"title": "The Night Circus", "author": "Erin Morgenstern", "genre": "Fantasy", "year": 2011, "pages": 387, "isbn": "9780385534635", "description": "Two young magicians are pitted against each other in a competition that takes place in a mysterious black-and-white circus.", "mood_tags": ["Dreamy", "Romantic", "Mystery"], "cover_url": ""},
    {"title": "Piranesi", "author": "Susanna Clarke", "genre": "Fantasy", "year": 2020, "pages": 272, "isbn": "9781635575637", "description": "A man lives alone in a magical house of infinite halls and tides, slowly uncovering the truth about his world.", "mood_tags": ["Mystery", "Dreamy", "Peaceful"], "cover_url": ""},
    {"title": "The Cruel Prince", "author": "Holly Black", "genre": "Fantasy", "year": 2018, "pages": 370, "isbn": "9780316310314", "description": "A mortal girl navigates the treacherous politics of Faerie to secure her place in a world that despises her.", "mood_tags": ["Thrilling", "Romantic", "Adventurous"], "cover_url": ""},
    {"title": "Children of Blood and Bone", "author": "Tomi Adeyemi", "genre": "Fantasy", "year": 2018, "pages": 525, "isbn": "9781250170972", "description": "A West African-inspired world where a young woman must restore magic before it disappears forever.", "mood_tags": ["Motivated", "Adventurous", "Thrilling"], "cover_url": ""},
    {"title": "An Ember in the Ashes", "author": "Sabaa Tahir", "genre": "Fantasy", "year": 2015, "pages": 446, "isbn": "9781595148049", "description": "A slave and a soldier are both fighting to survive a brutal Roman-inspired empire.", "mood_tags": ["Thrilling", "Romantic", "Motivated"], "cover_url": ""},
    {"title": "Fourth Wing", "author": "Rebecca Yarros", "genre": "Fantasy", "year": 2023, "pages": 517, "isbn": "9781649374042", "description": "A young woman enters a war college for dragon riders and falls for a dangerous classmate.", "mood_tags": ["Romantic", "Adventurous", "Thrilling"], "cover_url": ""},

    # ── Science Fiction ───────────────────────────────────────────────────────
    {"title": "Dune", "author": "Frank Herbert", "genre": "Science Fiction", "year": 1965, "pages": 412, "isbn": "9780441013593", "description": "A young nobleman's destiny unfolds on a desert planet that produces the universe's most valuable substance.", "mood_tags": ["Adventurous", "Motivated", "Dreamy"], "cover_url": ""},
    {"title": "The Hitchhiker's Guide to the Galaxy", "author": "Douglas Adams", "genre": "Science Fiction", "year": 1979, "pages": 193, "isbn": "9780345391803", "description": "An Englishman is swept into space after Earth is demolished to make way for a hyperspace bypass.", "mood_tags": ["Happy", "Peaceful", "Adventurous"], "cover_url": ""},
    {"title": "Project Hail Mary", "author": "Andy Weir", "genre": "Science Fiction", "year": 2021, "pages": 476, "isbn": "9780593135204", "description": "An astronaut wakes up alone in deep space with no memory, tasked with saving Earth.", "mood_tags": ["Thrilling", "Motivated", "Adventurous"], "cover_url": ""},
    {"title": "Ender's Game", "author": "Orson Scott Card", "genre": "Science Fiction", "year": 1985, "pages": 352, "isbn": "9780812550702", "description": "A gifted child is trained to become the military genius humanity needs to defeat an alien threat.", "mood_tags": ["Thrilling", "Motivated", "Adventurous"], "cover_url": ""},
    {"title": "The Martian", "author": "Andy Weir", "genre": "Science Fiction", "year": 2011, "pages": 369, "isbn": "9780804139021", "description": "An astronaut stranded on Mars must use ingenuity and humor to survive until rescue.", "mood_tags": ["Happy", "Motivated", "Thrilling"], "cover_url": ""},
    {"title": "Recursion", "author": "Blake Crouch", "genre": "Science Fiction", "year": 2019, "pages": 342, "isbn": "9781524759780", "description": "A neuroscientist's memory device has catastrophic consequences for the fabric of reality.", "mood_tags": ["Thrilling", "Mystery", "Adventurous"], "cover_url": ""},
    {"title": "Dark Matter", "author": "Blake Crouch", "genre": "Science Fiction", "year": 2016, "pages": 342, "isbn": "9781101904220", "description": "A physicist is kidnapped and wakes up in a life that isn't his — with a device that can travel between realities.", "mood_tags": ["Thrilling", "Mystery", "Adventurous"], "cover_url": ""},
    {"title": "The Long Way to a Small, Angry Planet", "author": "Becky Chambers", "genre": "Science Fiction", "year": 2014, "pages": 404, "isbn": "9781500453305", "description": "A crew of misfits travels across the galaxy on a tunneling ship, forming deep bonds along the way.", "mood_tags": ["Happy", "Peaceful", "Adventurous"], "cover_url": ""},
    {"title": "All Systems Red", "author": "Martha Wells", "genre": "Science Fiction", "year": 2017, "pages": 144, "isbn": "9780765397539", "description": "A socially anxious robot with free will would rather watch TV than deal with humans.", "mood_tags": ["Happy", "Peaceful", "Mystery"], "cover_url": ""},
    {"title": "Hyperion", "author": "Dan Simmons", "genre": "Science Fiction", "year": 1989, "pages": 482, "isbn": "9780553283686", "description": "Seven pilgrims travel to the planet Hyperion, each telling their story as they journey toward a mysterious creature.", "mood_tags": ["Adventurous", "Mystery", "Thrilling"], "cover_url": ""},
    {"title": "Klara and the Sun", "author": "Kazuo Ishiguro", "genre": "Science Fiction", "year": 2021, "pages": 307, "isbn": "9780571364879", "description": "An artificial friend observes the world with optimism while waiting to be chosen by a child.", "mood_tags": ["Sad", "Dreamy", "Peaceful"], "cover_url": ""},
    {"title": "Never Let Me Go", "author": "Kazuo Ishiguro", "genre": "Science Fiction", "year": 2005, "pages": 288, "isbn": "9780307740991", "description": "Three friends raised at a mysterious English boarding school slowly discover the dark truth of their existence.", "mood_tags": ["Sad", "Heartbroken", "Dreamy"], "cover_url": ""},
    {"title": "Station Eleven", "author": "Emily St. John Mandel", "genre": "Science Fiction", "year": 2014, "pages": 333, "isbn": "9780804172448", "description": "A flu pandemic collapses civilization. Twenty years later, a traveling theatre troupe keeps art alive.", "mood_tags": ["Sad", "Dreamy", "Peaceful"], "cover_url": ""},

    # ── Mystery / Thriller ────────────────────────────────────────────────────
    {"title": "Gone Girl", "author": "Gillian Flynn", "genre": "Thriller", "year": 2012, "pages": 422, "isbn": "9780307588371", "description": "A woman disappears on her wedding anniversary, and her husband becomes the prime suspect.", "mood_tags": ["Thrilling", "Mystery", "Heartbroken"], "cover_url": ""},
    {"title": "The Girl with the Dragon Tattoo", "author": "Stieg Larsson", "genre": "Mystery", "year": 2005, "pages": 465, "isbn": "9780307454546", "description": "A disgraced journalist and a hacker investigate a decades-old disappearance within a powerful family.", "mood_tags": ["Thrilling", "Mystery", "Motivated"], "cover_url": ""},
    {"title": "And Then There Were None", "author": "Agatha Christie", "genre": "Mystery", "year": 1939, "pages": 264, "isbn": "9780062073488", "description": "Ten strangers are lured to an island and killed one by one — with no obvious murderer.", "mood_tags": ["Thrilling", "Mystery"], "cover_url": ""},
    {"title": "Big Little Lies", "author": "Liane Moriarty", "genre": "Thriller", "year": 2014, "pages": 460, "isbn": "9780399167065", "description": "Three women's seemingly perfect lives unravel in the wake of a murder at a school trivia night.", "mood_tags": ["Thrilling", "Mystery", "Heartbroken"], "cover_url": ""},
    {"title": "The Thursday Murder Club", "author": "Richard Osman", "genre": "Mystery", "year": 2020, "pages": 382, "isbn": "9781984880963", "description": "Four retirees in a leafy village solve cold cases — until a real murder lands on their doorstep.", "mood_tags": ["Happy", "Mystery", "Peaceful"], "cover_url": ""},
    {"title": "Verity", "author": "Colleen Hoover", "genre": "Thriller", "year": 2018, "pages": 336, "isbn": "9781538724736", "description": "A struggling writer discovers a disturbing manuscript hidden in a bestselling author's home.", "mood_tags": ["Thrilling", "Mystery", "Heartbroken"], "cover_url": ""},
    {"title": "In the Woods", "author": "Tana French", "genre": "Mystery", "year": 2007, "pages": 429, "isbn": "9780143113492", "description": "A Dublin detective with a haunted past investigates a murder in a woods connected to his childhood trauma.", "mood_tags": ["Mystery", "Sad", "Thrilling"], "cover_url": ""},
    {"title": "The Silent Patient", "author": "Alex Michaelides", "genre": "Thriller", "year": 2019, "pages": 336, "isbn": "9781250301697", "description": "A famous painter shoots her husband five times then never speaks again. A therapist becomes obsessed with uncovering why.", "mood_tags": ["Thrilling", "Mystery"], "cover_url": ""},
    {"title": "Sharp Objects", "author": "Gillian Flynn", "genre": "Thriller", "year": 2006, "pages": 254, "isbn": "9780307341556", "description": "A journalist returns to her hometown to cover murders and confronts the psychological wounds of her past.", "mood_tags": ["Thrilling", "Mystery", "Sad"], "cover_url": ""},
    {"title": "The House in the Cerulean Sea", "author": "TJ Klune", "genre": "Mystery", "year": 2020, "pages": 394, "isbn": "9781250217318", "description": "A caseworker is sent to investigate a magical orphanage housing the most dangerous children in the world.", "mood_tags": ["Happy", "Peaceful", "Romantic"], "cover_url": ""},

    # ── Romance ───────────────────────────────────────────────────────────────
    {"title": "Pride and Prejudice", "author": "Jane Austen", "genre": "Romance", "year": 1813, "pages": 432, "isbn": "9780141439518", "description": "Elizabeth Bennet navigates love, social class, and the insufferable Mr. Darcy in Regency England.", "mood_tags": ["Romantic", "Happy", "Peaceful"], "cover_url": ""},
    {"title": "The Hating Game", "author": "Sally Thorne", "genre": "Romance", "year": 2016, "pages": 365, "isbn": "9780062439598", "description": "Two co-workers at a publishing company compete for the same promotion while hiding their feelings.", "mood_tags": ["Romantic", "Happy"], "cover_url": ""},
    {"title": "Beach Read", "author": "Emily Henry", "genre": "Romance", "year": 2020, "pages": 361, "isbn": "9781984806734", "description": "A romance writer and a literary fiction author swap genres for the summer — and fall for each other.", "mood_tags": ["Romantic", "Happy", "Peaceful"], "cover_url": ""},
    {"title": "People We Meet on Vacation", "author": "Emily Henry", "genre": "Romance", "year": 2021, "pages": 356, "isbn": "9781984806758", "description": "Two best friends take annual vacations together until a fight tears them apart. Years later, they try one more trip.", "mood_tags": ["Romantic", "Happy", "Heartbroken"], "cover_url": ""},
    {"title": "The Love Hypothesis", "author": "Ali Hazelwood", "genre": "Romance", "year": 2021, "pages": 356, "isbn": "9780593336823", "description": "A biology PhD student fake-dates a grumpy professor to convince her friend she's moved on.", "mood_tags": ["Romantic", "Happy"], "cover_url": ""},
    {"title": "It Ends with Us", "author": "Colleen Hoover", "genre": "Romance", "year": 2016, "pages": 385, "isbn": "9781501110375", "description": "A young woman navigates love, difficult choices, and the cycle of abuse in relationships.", "mood_tags": ["Romantic", "Heartbroken", "Sad"], "cover_url": ""},
    {"title": "Outlander", "author": "Diana Gabaldon", "genre": "Romance", "year": 1991, "pages": 850, "isbn": "9780440212560", "description": "A WWII nurse is hurled back in time to 18th century Scotland and caught between two worlds — and two men.", "mood_tags": ["Romantic", "Adventurous", "Thrilling"], "cover_url": ""},
    {"title": "The Notebook", "author": "Nicholas Sparks", "genre": "Romance", "year": 1996, "pages": 214, "isbn": "9780446676090", "description": "An elderly man reads a love story from a notebook to a woman who no longer remembers their life together.", "mood_tags": ["Romantic", "Sad", "Heartbroken"], "cover_url": ""},
    {"title": "Normal People", "author": "Sally Rooney", "genre": "Romance", "year": 2018, "pages": 266, "isbn": "9780571334650", "description": "Two young Irish students navigate an intense on-again, off-again relationship through university.", "mood_tags": ["Romantic", "Heartbroken", "Sad"], "cover_url": ""},
    {"title": "One Day in December", "author": "Josie Silver", "genre": "Romance", "year": 2018, "pages": 393, "isbn": "9780525622147", "description": "A woman spots her dream man on a bus and spends years missing him before fate intervenes.", "mood_tags": ["Romantic", "Heartbroken", "Happy"], "cover_url": ""},

    # ── Literary Fiction ──────────────────────────────────────────────────────
    {"title": "The Alchemist", "author": "Paulo Coelho", "genre": "Literary Fiction", "year": 1988, "pages": 208, "isbn": "9780062315007", "description": "A shepherd boy journeys from Spain to Egypt in search of treasure and discovers that the greatest treasure lies within.", "mood_tags": ["Motivated", "Peaceful", "Dreamy"], "cover_url": ""},
    {"title": "To Kill a Mockingbird", "author": "Harper Lee", "genre": "Literary Fiction", "year": 1960, "pages": 281, "isbn": "9780061935466", "description": "Through the eyes of a child in Alabama, a story of racial injustice and moral courage unfolds.", "mood_tags": ["Motivated", "Sad", "Peaceful"], "cover_url": ""},
    {"title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "genre": "Literary Fiction", "year": 1925, "pages": 180, "isbn": "9780743273565", "description": "The mysterious millionaire Jay Gatsby pursues his obsessive dream in the glittering excess of 1920s America.", "mood_tags": ["Heartbroken", "Dreamy", "Sad"], "cover_url": ""},
    {"title": "Educated", "author": "Tara Westover", "genre": "Memoir", "year": 2018, "pages": 334, "isbn": "9780399590504", "description": "A woman raised in a survivalist family in Idaho escapes to education and must reconcile her past.", "mood_tags": ["Motivated", "Sad", "Thrilling"], "cover_url": ""},
    {"title": "Sapiens", "author": "Yuval Noah Harari", "genre": "Non-fiction", "year": 2011, "pages": 443, "isbn": "9780062316097", "description": "A brief history of humankind from the Stone Age to the present.", "mood_tags": ["Motivated", "Adventurous", "Peaceful"], "cover_url": ""},
    {"title": "The Kite Runner", "author": "Khaled Hosseini", "genre": "Literary Fiction", "year": 2003, "pages": 372, "isbn": "9781594480003", "description": "A man returns to a war-torn Afghanistan to make up for the betrayal of his childhood best friend.", "mood_tags": ["Sad", "Heartbroken", "Motivated"], "cover_url": ""},
    {"title": "A Little Life", "author": "Hanya Yanagihara", "genre": "Literary Fiction", "year": 2015, "pages": 720, "isbn": "9780804172707", "description": "Four friends navigate life in New York City, anchored by the haunted past of one brilliant man.", "mood_tags": ["Sad", "Heartbroken"], "cover_url": ""},
    {"title": "The Secret History", "author": "Donna Tartt", "genre": "Literary Fiction", "year": 1992, "pages": 559, "isbn": "9781400031702", "description": "A group of elite classics students at a Vermont college commit a murder and spiral into paranoia.", "mood_tags": ["Thrilling", "Mystery", "Dreamy"], "cover_url": ""},
    {"title": "Pachinko", "author": "Min Jin Lee", "genre": "Literary Fiction", "year": 2017, "pages": 485, "isbn": "9781455563920", "description": "An epic spanning four generations of a Korean family living in Japan, navigating identity and survival.", "mood_tags": ["Sad", "Motivated", "Peaceful"], "cover_url": ""},
    {"title": "Lessons in Chemistry", "author": "Bonnie Garmus", "genre": "Literary Fiction", "year": 2022, "pages": 390, "isbn": "9780385547345", "description": "A female chemist becomes a cooking show host in the 1960s and accidentally starts a feminist revolution.", "mood_tags": ["Happy", "Motivated", "Peaceful"], "cover_url": ""},
    {"title": "The Midnight Library", "author": "Matt Haig", "genre": "Literary Fiction", "year": 2020, "pages": 288, "isbn": "9780525559474", "description": "A woman finds a library between life and death containing books about all the lives she could have lived.", "mood_tags": ["Sad", "Peaceful", "Motivated"], "cover_url": ""},
    {"title": "Where the Crawdads Sing", "author": "Delia Owens", "genre": "Literary Fiction", "year": 2018, "pages": 370, "isbn": "9780735224292", "description": "A girl raised alone in the marshes of North Carolina becomes the prime suspect in a murder mystery.", "mood_tags": ["Sad", "Mystery", "Dreamy"], "cover_url": ""},
    {"title": "Remarkably Bright Creatures", "author": "Shelby Van Pelt", "genre": "Literary Fiction", "year": 2022, "pages": 360, "isbn": "9780063204157", "description": "A widowed woman working at an aquarium forms an unlikely friendship with a giant Pacific octopus.", "mood_tags": ["Peaceful", "Happy", "Sad"], "cover_url": ""},
    {"title": "Tomorrow, and Tomorrow, and Tomorrow", "author": "Gabrielle Zevin", "genre": "Literary Fiction", "year": 2022, "pages": 401, "isbn": "9780593321201", "description": "Two friends and collaborators build video games together over thirty years, navigating love, ambition, and grief.", "mood_tags": ["Heartbroken", "Motivated", "Peaceful"], "cover_url": ""},
    {"title": "Demon Copperhead", "author": "Barbara Kingsolver", "genre": "Literary Fiction", "year": 2022, "pages": 548, "isbn": "9780063251922", "description": "A modern retelling of David Copperfield set in the Appalachian opioid crisis.", "mood_tags": ["Sad", "Motivated", "Thrilling"], "cover_url": ""},

    # ── Historical Fiction ────────────────────────────────────────────────────
    {"title": "The Pillars of the Earth", "author": "Ken Follett", "genre": "Historical Fiction", "year": 1989, "pages": 973, "isbn": "9780451166890", "description": "The building of a cathedral in 12th century England becomes the backdrop for decades of power, passion, and betrayal.", "mood_tags": ["Adventurous", "Romantic", "Motivated"], "cover_url": ""},
    {"title": "All the Light We Cannot See", "author": "Anthony Doerr", "genre": "Historical Fiction", "year": 2014, "pages": 531, "isbn": "9781476746586", "description": "A blind French girl and a German boy's lives converge in occupied France during World War II.", "mood_tags": ["Sad", "Adventurous", "Dreamy"], "cover_url": ""},
    {"title": "The Book Thief", "author": "Markus Zusak", "genre": "Historical Fiction", "year": 2005, "pages": 552, "isbn": "9780375842207", "description": "Narrated by Death, a girl steals books in Nazi Germany and finds solace in words amid the chaos of war.", "mood_tags": ["Sad", "Motivated", "Heartbroken"], "cover_url": ""},
    {"title": "Wolf Hall", "author": "Hilary Mantel", "genre": "Historical Fiction", "year": 2009, "pages": 532, "isbn": "9780312429980", "description": "Thomas Cromwell rises through the treacherous court of Henry VIII in Tudor England.", "mood_tags": ["Thrilling", "Adventurous", "Mystery"], "cover_url": ""},
    {"title": "The Alice Network", "author": "Kate Quinn", "genre": "Historical Fiction", "year": 2017, "pages": 502, "isbn": "9780062654199", "description": "A female spy network in WWI intertwines with a 1947 search for a missing cousin.", "mood_tags": ["Adventurous", "Thrilling", "Motivated"], "cover_url": ""},
    {"title": "Hamnet", "author": "Maggie O'Farrell", "genre": "Historical Fiction", "year": 2020, "pages": 301, "isbn": "9780525657606", "description": "The story behind the death of Shakespeare's son and its profound impact on the playwright and his wife.", "mood_tags": ["Sad", "Heartbroken", "Dreamy"], "cover_url": ""},
    {"title": "The Miniaturist", "author": "Jessie Burton", "genre": "Historical Fiction", "year": 2014, "pages": 386, "isbn": "9781250056412", "description": "A young bride in 17th-century Amsterdam discovers her new house holds dark secrets.", "mood_tags": ["Mystery", "Dreamy", "Thrilling"], "cover_url": ""},
    {"title": "Lincoln in the Bardo", "author": "George Saunders", "genre": "Historical Fiction", "year": 2017, "pages": 343, "isbn": "9780812985405", "description": "President Lincoln visits his dead son's crypt while ghosts populate a purgatory around them.", "mood_tags": ["Sad", "Dreamy", "Peaceful"], "cover_url": ""},

    # ── Memoir / Non-fiction ──────────────────────────────────────────────────
    {"title": "The Year of Magical Thinking", "author": "Joan Didion", "genre": "Memoir", "year": 2005, "pages": 227, "isbn": "9781400043637", "description": "A raw memoir about grief written in the year following the sudden death of her husband.", "mood_tags": ["Sad", "Heartbroken", "Peaceful"], "cover_url": ""},
    {"title": "When Breath Becomes Air", "author": "Paul Kalanithi", "genre": "Memoir", "year": 2016, "pages": 228, "isbn": "9780812988406", "description": "A neurosurgeon diagnosed with terminal cancer reflects on the meaning of life and death.", "mood_tags": ["Sad", "Motivated", "Peaceful"], "cover_url": ""},
    {"title": "The Glass Castle", "author": "Jeannette Walls", "genre": "Memoir", "year": 2005, "pages": 288, "isbn": "9780743247542", "description": "A journalist recounts her unconventional, poverty-stricken childhood with eccentric nomadic parents.", "mood_tags": ["Sad", "Motivated", "Thrilling"], "cover_url": ""},
    {"title": "Born a Crime", "author": "Trevor Noah", "genre": "Memoir", "year": 2016, "pages": 304, "isbn": "9780399588174", "description": "The Daily Show host's memoir about growing up mixed-race in apartheid South Africa.", "mood_tags": ["Happy", "Motivated", "Sad"], "cover_url": ""},
    {"title": "Atomic Habits", "author": "James Clear", "genre": "Non-fiction", "year": 2018, "pages": 320, "isbn": "9780735211292", "description": "A practical guide to building good habits and breaking bad ones through small incremental changes.", "mood_tags": ["Motivated"], "cover_url": ""},
    {"title": "The Body Keeps the Score", "author": "Bessel van der Kolk", "genre": "Non-fiction", "year": 2014, "pages": 464, "isbn": "9780143127741", "description": "How trauma reshapes the mind and body, and the paths to recovery.", "mood_tags": ["Peaceful", "Sad", "Motivated"], "cover_url": ""},
    {"title": "Thinking, Fast and Slow", "author": "Daniel Kahneman", "genre": "Non-fiction", "year": 2011, "pages": 499, "isbn": "9780374533557", "description": "Nobel laureate explores the two systems of thought that shape our judgments and decisions.", "mood_tags": ["Motivated", "Peaceful"], "cover_url": ""},
    {"title": "Greenlights", "author": "Matthew McConaughey", "genre": "Memoir", "year": 2020, "pages": 288, "isbn": "9780593139134", "description": "The actor's memoir of adventure, philosophy, and the lessons he learned living life on his own terms.", "mood_tags": ["Motivated", "Happy", "Adventurous"], "cover_url": ""},

    # ── Young Adult ───────────────────────────────────────────────────────────
    {"title": "The Hunger Games", "author": "Suzanne Collins", "genre": "Science Fiction", "year": 2008, "pages": 374, "isbn": "9780439023481", "description": "In a dystopian future, a girl volunteers to take her sister's place in a televised fight to the death.", "mood_tags": ["Thrilling", "Motivated", "Adventurous"], "cover_url": ""},
    {"title": "Harry Potter and the Sorcerer's Stone", "author": "J.K. Rowling", "genre": "Fantasy", "year": 1997, "pages": 309, "isbn": "9780590353427", "description": "An orphan boy discovers he is a wizard and enters a magical world of wonder, friendship, and danger.", "mood_tags": ["Happy", "Adventurous", "Dreamy"], "cover_url": ""},
    {"title": "The Fault in Our Stars", "author": "John Green", "genre": "Literary Fiction", "year": 2012, "pages": 313, "isbn": "9780525478812", "description": "Two teenagers with cancer fall in love and grapple with the big questions about life and legacy.", "mood_tags": ["Romantic", "Sad", "Heartbroken"], "cover_url": ""},
    {"title": "Divergent", "author": "Veronica Roth", "genre": "Science Fiction", "year": 2011, "pages": 487, "isbn": "9780062024022", "description": "A dystopian Chicago where society is divided into five factions based on virtues — and one girl doesn't fit.", "mood_tags": ["Thrilling", "Motivated", "Adventurous"], "cover_url": ""},
    {"title": "The Maze Runner", "author": "James Dashner", "genre": "Science Fiction", "year": 2009, "pages": 374, "isbn": "9780385737951", "description": "A boy wakes up in a giant maze with no memory of who he is — and must escape before the Grievers come.", "mood_tags": ["Thrilling", "Adventurous", "Mystery"], "cover_url": ""},
    {"title": "Aristotle and Dante Discover the Secrets of the Universe", "author": "Benjamin Alire Sáenz", "genre": "Literary Fiction", "year": 2012, "pages": 359, "isbn": "9781442408920", "description": "Two Mexican-American boys form a friendship that transforms them in 1987 El Paso.", "mood_tags": ["Romantic", "Peaceful", "Sad"], "cover_url": ""},
    {"title": "They Both Die at the End", "author": "Adam Silvera", "genre": "Literary Fiction", "year": 2017, "pages": 373, "isbn": "9780062457790", "description": "Two strangers receive a call telling them they will die today — and spend their last day together.", "mood_tags": ["Sad", "Heartbroken", "Romantic"], "cover_url": ""},
    {"title": "Simon vs. the Homo Sapiens Agenda", "author": "Becky Albertalli", "genre": "Romance", "year": 2015, "pages": 303, "isbn": "9780062348685", "description": "A high schooler is outed before he's ready and must find the anonymous classmate he fell for online.", "mood_tags": ["Romantic", "Happy", "Sad"], "cover_url": ""},

    # ── Mythology / Classics ──────────────────────────────────────────────────
    {"title": "Percy Jackson and the Lightning Thief", "author": "Rick Riordan", "genre": "Fantasy", "year": 2005, "pages": 377, "isbn": "9780786838653", "description": "A dyslexic boy discovers he's the son of a Greek god and must prevent a war between the Olympians.", "mood_tags": ["Happy", "Adventurous", "Thrilling"], "cover_url": ""},
    {"title": "Song of Achilles", "author": "Madeline Miller", "genre": "Historical Fiction", "year": 2011, "pages": 378, "isbn": "9780062060624", "description": "A retelling of the Iliad through the love story between Achilles and Patroclus.", "mood_tags": ["Romantic", "Sad", "Heartbroken"], "cover_url": ""},
    {"title": "Norse Mythology", "author": "Neil Gaiman", "genre": "Fantasy", "year": 2017, "pages": 299, "isbn": "9780393609097", "description": "Neil Gaiman retells the ancient Norse myths of Odin, Thor, Loki, and the creation and destruction of worlds.", "mood_tags": ["Adventurous", "Dreamy", "Peaceful"], "cover_url": ""},
    {"title": "Mythos", "author": "Stephen Fry", "genre": "Non-fiction", "year": 2017, "pages": 352, "isbn": "9781452163307", "description": "Stephen Fry retells the Greek myths with wit, love, and irreverence.", "mood_tags": ["Happy", "Adventurous", "Dreamy"], "cover_url": ""},

    # ── Horror / Dark ─────────────────────────────────────────────────────────
    {"title": "Mexican Gothic", "author": "Silvia Moreno-Garcia", "genre": "Thriller", "year": 2020, "pages": 301, "isbn": "9780525620785", "description": "A glamorous socialite investigates a gothic mansion in 1950s Mexico where something ancient and evil dwells.", "mood_tags": ["Thrilling", "Mystery", "Dreamy"], "cover_url": ""},
    {"title": "The Haunting of Hill House", "author": "Shirley Jackson", "genre": "Thriller", "year": 1959, "pages": 246, "isbn": "9780143039983", "description": "Four people explore a notoriously haunted mansion and find the house drawing one of them into its evil.", "mood_tags": ["Thrilling", "Mystery"], "cover_url": ""},
    {"title": "IT", "author": "Stephen King", "genre": "Thriller", "year": 1986, "pages": 1138, "isbn": "9781501156700", "description": "Seven childhood friends face an ancient evil that preys on children in the town of Derry, Maine.", "mood_tags": ["Thrilling", "Adventurous", "Mystery"], "cover_url": ""},
    {"title": "Plain Bad Heroines", "author": "Emily M. Danforth", "genre": "Thriller", "year": 2020, "pages": 624, "isbn": "9780062942937", "description": "A cursed New England school for girls in 1902 intertwines with a Hollywood adaptation being filmed today.", "mood_tags": ["Mystery", "Thrilling", "Dreamy"], "cover_url": ""},

    # ── Contemporary / Feel-good ──────────────────────────────────────────────
    {"title": "The Rosie Project", "author": "Graeme Simsion", "genre": "Romance", "year": 2013, "pages": 295, "isbn": "9781476729060", "description": "A socially challenged genetics professor creates a questionnaire to find the perfect wife — and meets entirely the wrong woman.", "mood_tags": ["Happy", "Romantic", "Peaceful"], "cover_url": ""},
    {"title": "Eleanor Oliphant is Completely Fine", "author": "Gail Honeyman", "genre": "Literary Fiction", "year": 2017, "pages": 327, "isbn": "9780735220690", "description": "A fiercely singular woman navigating loneliness, trauma, and human connection in a way that's both funny and devastating.", "mood_tags": ["Peaceful", "Sad", "Happy"], "cover_url": ""},
    {"title": "A Man Called Ove", "author": "Fredrik Backman", "genre": "Literary Fiction", "year": 2012, "pages": 337, "isbn": "9781476738024", "description": "A curmudgeonly Swedish man with strict principles has his lonely retirement disrupted by new neighbours.", "mood_tags": ["Happy", "Sad", "Peaceful"], "cover_url": ""},
    {"title": "The Unlikely Pilgrimage of Harold Fry", "author": "Rachel Joyce", "genre": "Literary Fiction", "year": 2012, "pages": 320, "isbn": "9780812983456", "description": "A retired man sets off on foot to walk 600 miles across England to visit a dying friend.", "mood_tags": ["Peaceful", "Motivated", "Sad"], "cover_url": ""},
    {"title": "Anxious People", "author": "Fredrik Backman", "genre": "Literary Fiction", "year": 2019, "pages": 341, "isbn": "9781501160844", "description": "A bank robber accidentally takes an apartment viewing hostage. What follows is absurd, tender, and profound.", "mood_tags": ["Happy", "Peaceful", "Sad"], "cover_url": ""},
]


def seed():
    db = SessionLocal()
    try:
        existing = db.query(Book).count()
        if existing >= len(BOOKS):
            print(f"Already have {existing} books. Skipping seed.")
            return

        added = 0
        for b in BOOKS:
            exists = db.query(Book).filter(Book.isbn == b["isbn"]).first()
            if not exists:
                book = Book(
                    title=b["title"],
                    author=b["author"],
                    genre=b["genre"],
                    year=b.get("year"),
                    pages=b.get("pages"),
                    isbn=b.get("isbn"),
                    description=b.get("description", ""),
                    mood_tags=b.get("mood_tags", []),
                    cover_url=b.get("cover_url", ""),
                )
                db.add(book)
                added += 1

        db.commit()
        print(f"✅ Seeded {added} new books. Total: {db.query(Book).count()}")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()