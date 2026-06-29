// Math Fact Database for the Gacha System

export const MathFactDB = [
    // COMMON (Basic Geometry & Algebra)
    { 
        id: 1, rarity: 'Common', author: 'Pythagoras', title: 'Pythagorean Theorem', 
        equation: 'a² + b² = c²', 
        text: 'In a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides. It is one of the most fundamental rules of geometry.',
        key: [
            { symbol: 'a', meaning: 'Length of the first short leg of the triangle' },
            { symbol: 'b', meaning: 'Length of the second short leg of the triangle' },
            { symbol: 'c', meaning: 'Length of the hypotenuse (the longest side)' }
        ],
        quizzes: [
            {
                question: 'If a triangle has short legs of length 3 and 4, how long is the hypotenuse (c)?',
                options: ['5', '7', '12', '25'],
                correctAnswerIndex: 0,
                explanation: '3² + 4² = c² => 9 + 16 = 25. The square root of 25 is 5!'
            },
            {
                question: 'If the hypotenuse is 10 and one leg is 6, what is the length of the other leg?',
                options: ['4', '6', '8', '16'],
                correctAnswerIndex: 2,
                explanation: 'a² + 6² = 10² => a² + 36 = 100. a² = 64. The square root of 64 is 8!'
            }
        ]
    },
    { 
        id: 2, rarity: 'Common', author: 'Archimedes', title: 'Area of a Circle', 
        equation: 'A = πr²', 
        text: 'Calculates the total space enclosed within a perfect circle. Archimedes approximated the value of Pi (π) to make this calculation possible.',
        key: [
            { symbol: 'A', meaning: 'Total Area' },
            { symbol: 'π', meaning: 'Pi, a mathematical constant approximately equal to 3.14159' },
            { symbol: 'r', meaning: 'Radius (distance from the center to the edge)' }
        ],
        quizzes: [
            {
                question: 'If a circle has a radius of 2 meters, what is its approximate Area?',
                options: ['6.28', '12.56', '4', '3.14'],
                correctAnswerIndex: 1,
                explanation: 'A = π * 2². Therefore A = π * 4. Since π is ~3.14, the area is ~12.56.'
            },
            {
                question: 'What happens to the area of a circle if you double its radius?',
                options: ['It doubles', 'It quadruples (x4)', 'It halves', 'It stays the same'],
                correctAnswerIndex: 1,
                explanation: 'Because the radius is squared (r²), doubling it (2r) becomes (2r)² which equals 4r². The area increases by a factor of 4!'
            }
        ]
    },
    { 
        id: 3, rarity: 'Common', author: 'Al-Khwarizmi', title: 'Quadratic Formula', 
        equation: 'x = (-b ± √(b² - 4ac)) / 2a', 
        text: 'Provides the solutions (roots) to any quadratic equation. Al-Khwarizmi, a Persian mathematician, is often considered the father of modern algebra.',
        key: [
            { symbol: 'x', meaning: 'The unknown variable (the roots)' },
            { symbol: 'a, b, c', meaning: 'Known coefficients from the standard form ax² + bx + c = 0' },
            { symbol: '±', meaning: 'Plus or minus, indicating there are usually two solutions' }
        ],
        quizzes: [
            {
                question: 'Why does the formula use a "±" (Plus or Minus) symbol?',
                options: ['Because it is an approximation', 'To cancel out the division by zero', 'Because a parabola crosses the X-axis twice', 'Because a, b, and c are unknown'],
                correctAnswerIndex: 2,
                explanation: 'A quadratic equation plots a parabola (U-shape). The ± gives you two answers, representing the two places the curve crosses the X-axis!'
            },
            {
                question: 'What is the part inside the square root (b² - 4ac) called?',
                options: ['The Determiner', 'The Discriminant', 'The Denominator', 'The Derivative'],
                correctAnswerIndex: 1,
                explanation: 'It is called the Discriminant. If it is negative, you can\'t take the square root of it, meaning the parabola never touches the X-axis!'
            }
        ]
    },
    { 
        id: 11, rarity: 'Common', author: 'George Boole', title: 'Boolean AND Logic', 
        equation: 'A ∧ B = True', 
        text: 'The foundation of all modern computers. Boolean logic operates purely on True (1) or False (0) states. The AND operator requires both inputs to be true.',
        key: [
            { symbol: 'A', meaning: 'First statement or input' },
            { symbol: 'B', meaning: 'Second statement or input' },
            { symbol: '∧', meaning: 'Logical AND operator' }
        ],
        quizzes: [
            {
                question: 'If A is False and B is True, what is the result of (A ∧ B)?',
                options: ['True', 'False', 'Undefined', '0.5'],
                correctAnswerIndex: 1,
                explanation: 'In an AND (∧) operation, ALL inputs must be True. Since A is False, the entire statement evaluates to False (0).'
            },
            {
                question: 'How many True inputs do you need for a 3-input AND gate to output True?',
                options: ['One', 'Two', 'All Three', 'None'],
                correctAnswerIndex: 2,
                explanation: 'An AND gate acts like a strict bouncer. Every single requirement must be met. You need all three to be True!'
            }
        ]
    },
    { 
        id: 15, rarity: 'Common', author: 'René Descartes', title: 'Linear Equation', 
        equation: 'y = mx + b', 
        text: 'The classic equation for a straight line on a graph. Descartes invented the Cartesian coordinate system, allowing algebra and geometry to merge.',
        key: [
            { symbol: 'y & x', meaning: 'Coordinates on the graph' },
            { symbol: 'm', meaning: 'The slope or steepness of the line' },
            { symbol: 'b', meaning: 'The Y-intercept (where the line crosses the Y axis)' }
        ],
        quizzes: [
            {
                question: 'If m is 0, what does the line look like on a graph?',
                options: ['A vertical line', 'A perfect diagonal', 'A flat horizontal line', 'A circle'],
                correctAnswerIndex: 2,
                explanation: 'If the slope (m) is 0, the line has no steepness at all. It just becomes y = b, a perfectly flat horizontal line!'
            },
            {
                question: 'If the equation is y = 2x + 5, where does the line cross the Y-axis?',
                options: ['At y = 2', 'At y = 5', 'At x = 5', 'At x = 2'],
                correctAnswerIndex: 1,
                explanation: 'The b value is 5, which represents the Y-intercept. That means when x is 0, y is 5!'
            }
        ]
    },
    
    // RARE (Calculus & Sequences)
    { 
        id: 4, rarity: 'Rare', author: 'Isaac Newton', title: 'Fundamental Theorem of Calculus', 
        equation: '∫ f(x)dx = F(b) - F(a)', 
        text: 'Links the concept of differentiating a function (finding its slope) with the concept of integrating a function (finding the area under its curve).',
        key: [
            { symbol: '∫', meaning: 'The integral symbol (representing continuous summation)' },
            { symbol: 'f(x)', meaning: 'The derivative function' },
            { symbol: 'F(b) - F(a)', meaning: 'The original function evaluated at the upper and lower bounds' }
        ],
        quizzes: [
            {
                question: 'If you integrate a Velocity function over time, what physical property do you calculate?',
                options: ['Acceleration', 'Mass', 'Distance Traveled', 'Force'],
                correctAnswerIndex: 2,
                explanation: 'Velocity is the derivative of position. Integrating velocity reverses the process, giving you the total distance traveled over that time period!'
            },
            {
                question: 'What happens if you calculate the integral with identical bounds (F(a) - F(a))?',
                options: ['Infinity', 'Undefined', 'One', 'Zero'],
                correctAnswerIndex: 3,
                explanation: 'You are calculating the area of a line that has no width. The area is zero!'
            }
        ]
    },
    { 
        id: 5, rarity: 'Rare', author: 'Fibonacci', title: 'Fibonacci Sequence', 
        equation: 'F_n = F_{n-1} + F_{n-2}', 
        text: 'A sequence where each number is the sum of the two preceding ones. This sequence appears constantly in nature, from pinecones to galaxies.',
        key: [
            { symbol: 'F_n', meaning: 'The current term in the sequence' },
            { symbol: 'F_{n-1}', meaning: 'The previous term' },
            { symbol: 'F_{n-2}', meaning: 'The term before the previous term' }
        ],
        quizzes: [
            {
                question: 'If the sequence is [..., 5, 8, 13, 21], what is the next number in the sequence?',
                options: ['29', '34', '42', '26'],
                correctAnswerIndex: 1,
                explanation: 'You simply add the two previous numbers. 13 + 21 = 34!'
            },
            {
                question: 'What famous mathematical ratio do the numbers of the Fibonacci sequence approach as they get larger?',
                options: ['Pi', 'Euler\'s Number', 'The Golden Ratio', 'The Speed of Light'],
                correctAnswerIndex: 2,
                explanation: 'If you divide a Fibonacci number by the one before it (e.g., 55/34), it gets closer and closer to Phi (1.618), the Golden Ratio!'
            }
        ]
    },
    { 
        id: 10, rarity: 'Rare', author: 'Phidias', title: 'The Golden Ratio', 
        equation: 'φ = (1 + √5) / 2', 
        text: 'An irrational number approximately equal to 1.618. It frequently appears in geometry, art, architecture, and nature because of its aesthetically pleasing proportions.',
        key: [
            { symbol: 'φ', meaning: 'Phi, the Golden Ratio' },
            { symbol: '1 and 2', meaning: 'Constants determining the exact ratio' },
            { symbol: '√5', meaning: 'Square root of 5' }
        ],
        quizzes: [
            {
                question: 'If a rectangle\'s short side is exactly 10cm, roughly how long should the long side be to form a "Golden Rectangle"?',
                options: ['12.5cm', '15cm', '16.18cm', '20cm'],
                correctAnswerIndex: 2,
                explanation: 'You multiply the short side by Phi (~1.618). 10 * 1.618 = 16.18cm!'
            },
            {
                question: 'Which of the following is famously believed to incorporate the Golden Ratio in its design?',
                options: ['The Great Pyramid of Giza', 'The Eiffel Tower', 'The Roman Colosseum', 'The Parthenon in Athens'],
                correctAnswerIndex: 3,
                explanation: 'The Parthenon\'s facade fits almost perfectly into a series of Golden Rectangles, a testament to ancient Greek aesthetics.'
            }
        ]
    },
    { 
        id: 16, rarity: 'Rare', author: 'Hipparchus', title: 'The Sine Wave', 
        equation: 'y = A * sin(ωt + φ)', 
        text: 'Describes a perfectly smooth, repetitive oscillation. Sine waves are used to model everything from ocean waves and sound waves to light and electricity.',
        key: [
            { symbol: 'A', meaning: 'Amplitude (how tall the wave is)' },
            { symbol: 'ω', meaning: 'Angular frequency (how fast the wave oscillates)' },
            { symbol: 'φ', meaning: 'Phase shift (where the wave starts)' }
        ],
        quizzes: [
            {
                question: 'If you increase the Amplitude (A) of a sound wave, how does the sound change?',
                options: ['It gets higher pitched', 'It gets louder', 'It gets slower', 'It stops entirely'],
                correctAnswerIndex: 1,
                explanation: 'Amplitude corresponds to volume! A taller sound wave is a louder sound wave.'
            },
            {
                question: 'What happens if you combine a sine wave with another sine wave perfectly out of phase?',
                options: ['They double in size', 'They cancel each other out entirely', 'They become a square wave', 'They turn into heat'],
                correctAnswerIndex: 1,
                explanation: 'This is called destructive interference. If a wave goes up exactly when another goes down, they add up to zero. This is how noise-canceling headphones work!'
            }
        ]
    },
    
    // EPIC (Famous Theorems)
    { 
        id: 6, rarity: 'Epic', author: 'Pierre de Fermat', title: 'Fermat\'s Last Theorem', 
        equation: 'aⁿ + bⁿ ≠ cⁿ (for n > 2)', 
        text: 'Fermat famously scribbled in a margin that he had a proof for this, but it was too large to fit. It drove mathematicians mad and took 358 years to finally prove!',
        key: [
            { symbol: 'a, b, c', meaning: 'Positive integers' },
            { symbol: 'n', meaning: 'An integer strictly greater than 2' },
            { symbol: '≠', meaning: 'Does not equal' }
        ],
        quizzes: [
            {
                question: 'According to this theorem, is it possible to find whole numbers where a³ + b³ = c³?',
                options: ['Yes, if a is prime', 'Yes, but the numbers are massive', 'No, it is impossible', 'Yes, but only in complex numbers'],
                correctAnswerIndex: 2,
                explanation: 'It is mathematically impossible. It only works for squared numbers (n=2, the Pythagorean theorem), but never for cubes or higher powers.'
            },
            {
                question: 'Who finally proved Fermat\'s Last Theorem in 1994?',
                options: ['Andrew Wiles', 'Albert Einstein', 'Stephen Hawking', 'Alan Turing'],
                correctAnswerIndex: 0,
                explanation: 'Sir Andrew Wiles finally proved it using highly advanced elliptical curve mathematics that hadn\'t even been invented in Fermat\'s time!'
            }
        ]
    },
    { 
        id: 7, rarity: 'Epic', author: 'Albert Einstein', title: 'Mass-Energy Equivalence', 
        equation: 'E = mc²', 
        text: 'Establishes that mass and energy are entirely interchangeable. Even a tiny amount of mass contains a massive amount of hidden energy.',
        key: [
            { symbol: 'E', meaning: 'Energy (in Joules)' },
            { symbol: 'm', meaning: 'Mass (in Kilograms)' },
            { symbol: 'c', meaning: 'The speed of light in a vacuum (approx 300,000,000 m/s)' }
        ],
        quizzes: [
            {
                question: 'Why does 1kg of matter contain so much energy?',
                options: ['Because gravity is strong', 'Because mass is heavy', 'Because the speed of light is huge and it gets squared', 'Because atoms move fast'],
                correctAnswerIndex: 2,
                explanation: 'The "c²" part of the equation is the speed of light squared, which is an unfathomably large number. Multiplying even a tiny mass by that results in massive energy!'
            },
            {
                question: 'If you theoretically turn an entire paperclip into pure energy, what is the rough equivalent output?',
                options: ['A lit match', 'A AA battery', 'A tank of gasoline', 'An atomic bomb'],
                correctAnswerIndex: 3,
                explanation: 'Because of c², a single gram of matter converted entirely into energy produces about 21 kilotons of TNT worth of energy—comparable to early atomic weapons!'
            }
        ]
    },
    { 
        id: 12, rarity: 'Epic', author: 'Leonhard Euler', title: 'Euler\'s Characteristic', 
        equation: 'V - E + F = 2', 
        text: 'A profound topological invariant for any convex polyhedron. No matter how you stretch or squish the 3D shape, this equation holds true as long as you don\'t tear it.',
        key: [
            { symbol: 'V', meaning: 'Number of Vertices (corners)' },
            { symbol: 'E', meaning: 'Number of Edges (lines)' },
            { symbol: 'F', meaning: 'Number of Faces (flat surfaces)' }
        ],
        quizzes: [
            {
                question: 'A standard cube has 8 Vertices and 6 Faces. How many Edges does it have according to the formula?',
                options: ['10', '12', '14', '16'],
                correctAnswerIndex: 1,
                explanation: 'V(8) - E(?) + F(6) = 2. Therefore 14 - E = 2. So E must be 12!'
            },
            {
                question: 'If you imagine a sphere made of polygons, what would its Euler characteristic be?',
                options: ['0', '1', '2', 'Infinity'],
                correctAnswerIndex: 2,
                explanation: 'Any shape that can be smoothly deformed into a sphere without tearing (like a cube, pyramid, or icosahedron) always has a characteristic of exactly 2!'
            }
        ]
    },
    { 
        id: 13, rarity: 'Epic', author: 'Thomas Bayes', title: 'Bayes\' Theorem', 
        equation: 'P(A|B) = [P(B|A) * P(A)] / P(B)', 
        text: 'The mathematical foundation of probability and machine learning. It describes the probability of an event based on prior knowledge of conditions related to the event.',
        key: [
            { symbol: 'P(A|B)', meaning: 'Probability of A given that B is true' },
            { symbol: 'P(B|A)', meaning: 'Probability of B given that A is true' },
            { symbol: 'P(A) & P(B)', meaning: 'Independent probabilities of A and B' }
        ],
        quizzes: [
            {
                question: 'If you test positive for a 1-in-a-million disease, and the test is 99% accurate, do you definitely have it?',
                options: ['Yes, 99% chance', 'No, the false-positive rate dominates the rarity', 'Yes, 100% chance', 'No, the test is broken'],
                correctAnswerIndex: 1,
                explanation: 'Because the disease is so incredibly rare (P(A)), out of a million people, 10,000 will get a false positive. You are much more likely to be a false positive!'
            },
            {
                question: 'What modern technology relies heavily on Bayesian probability filters?',
                options: ['Microwave Ovens', 'Email Spam Filters', 'Car Engines', 'Fiber Optic Cables'],
                correctAnswerIndex: 1,
                explanation: 'Spam filters use Bayes\' Theorem to calculate the probability an email is spam given the presence of specific words (like "lottery" or "prince").'
            }
        ]
    },
    { 
        id: 17, rarity: 'Epic', author: 'Johannes Kepler', title: 'Kepler\'s Third Law', 
        equation: 'T² ∝ r³', 
        text: 'Proves that the square of a planet\'s orbital period is proportional to the cube of the semi-major axis of its orbit. This finally explained exactly how planets move around the sun.',
        key: [
            { symbol: 'T', meaning: 'The orbital period (how long a year is on the planet)' },
            { symbol: 'r', meaning: 'The distance from the planet to the sun' },
            { symbol: '∝', meaning: 'Is proportional to' }
        ],
        quizzes: [
            {
                question: 'According to this law, what happens to a planet\'s year as it gets further from the sun?',
                options: ['Its year gets shorter', 'Its year stays the same', 'Its year gets significantly longer', 'It stops moving'],
                correctAnswerIndex: 2,
                explanation: 'Because distance is cubed (r³) while time is only squared (T²), moving a planet further away makes its orbit vastly slower and its year much longer!'
            },
            {
                question: 'If a planet is 4 times further from the sun than Earth, how long is its year?',
                options: ['4 Earth Years', '8 Earth Years', '16 Earth Years', '64 Earth Years'],
                correctAnswerIndex: 1,
                explanation: 'Distance cubed is 4³ = 64. Time squared is T². If T² = 64, then T must be 8. The planet has an 8-year orbit!'
            }
        ]
    },
    { 
        id: 18, rarity: 'Epic', author: 'Edward Lorenz', title: 'Chaos Theory', 
        equation: 'dx/dt = σ(y - x)', 
        text: 'The Lorenz Attractor equations show that in certain complex systems, incredibly tiny changes in the starting conditions lead to drastically different outcomes.',
        key: [
            { symbol: 'dx/dt', meaning: 'The rate of change over time' },
            { symbol: 'σ, x, y', meaning: 'Variables and constants mapping a 3D system' }
        ],
        quizzes: [
            {
                question: 'What is the popular name for the phenomenon described by Chaos Theory?',
                options: ['The Butterfly Effect', 'The Domino Effect', 'The Snowball Effect', 'The Ripple Effect'],
                correctAnswerIndex: 0,
                explanation: 'The Butterfly Effect states that a butterfly flapping its wings in Brazil could theoretically set off a chain reaction that causes a tornado in Texas!'
            },
            {
                question: 'Because of Chaos Theory, which of these is mathematically impossible to perfectly predict long-term?',
                options: ['The orbit of the moon', 'The exact weather 30 days from now', 'The speed of light', 'The area of a circle'],
                correctAnswerIndex: 1,
                explanation: 'Weather is a highly chaotic system. Even being off by 0.0001 degrees in our initial measurements today completely changes the forecast 30 days from now.'
            }
        ]
    },
    
    // LEGENDARY (Mind-Bending Equations)
    { 
        id: 8, rarity: 'Legendary', author: 'Leonhard Euler', title: 'Euler\'s Identity', 
        equation: 'e^(iπ) + 1 = 0', 
        text: 'Often called the most beautiful equation in mathematics. It seamlessly connects five of the most fundamental constants in math into a single, elegant statement.',
        key: [
            { symbol: 'e', meaning: 'Euler\'s number (base of the natural logarithm)' },
            { symbol: 'i', meaning: 'The imaginary unit (the square root of -1)' },
            { symbol: 'π', meaning: 'Pi (ratio of a circle\'s circumference to diameter)' },
            { symbol: '1 and 0', meaning: 'The multiplicative and additive identities' }
        ],
        quizzes: [
            {
                question: 'Why is this considered the most beautiful equation in math?',
                options: ['Because it is easy to memorize', 'Because it perfectly links geometry, algebra, and complex numbers to zero', 'Because Euler wrote it', 'Because it solves prime numbers'],
                correctAnswerIndex: 1,
                explanation: 'It links exactly five of the most fundamental constants from totally separate branches of math (e, i, π, 1, 0) into one perfectly balanced statement.'
            },
            {
                question: 'What is the value of the imaginary unit "i"?',
                options: ['Infinity', 'Zero', 'The square root of -1', 'Pi'],
                correctAnswerIndex: 2,
                explanation: 'i is the fundamental unit of complex numbers, defined as the square root of -1 (which is impossible using only real numbers!).'
            }
        ]
    },
    { 
        id: 9, rarity: 'Legendary', author: 'Erwin Schrödinger', title: 'Schrödinger Equation', 
        equation: 'iℏ ∂Ψ/∂t = ĤΨ', 
        text: 'The fundamental equation of quantum mechanics. It governs the wave function of a quantum-mechanical system, proving that particles act like waves.',
        key: [
            { symbol: 'i', meaning: 'Imaginary unit' },
            { symbol: 'ℏ', meaning: 'Reduced Planck constant' },
            { symbol: 'Ψ', meaning: 'The wave function of the quantum system' },
            { symbol: 'Ĥ', meaning: 'The Hamiltonian operator (total energy of the system)' }
        ],
        quizzes: [
            {
                question: 'What happens when you square the wave function (Ψ) calculated by this equation?',
                options: ['It gives you the exact speed of the particle', 'It destroys the particle', 'It gives you the probability cloud of where the particle might be', 'It creates energy'],
                correctAnswerIndex: 2,
                explanation: 'In quantum mechanics, you cannot know exactly where a particle is. Squaring Ψ gives you a probability distribution (a cloud) indicating where it likely is!'
            },
            {
                question: 'What famous thought experiment involves this equation and a feline?',
                options: ['Pavlov\'s Dog', 'Schrödinger\'s Cat', 'Einstein\'s Mouse', 'Newton\'s Bird'],
                correctAnswerIndex: 1,
                explanation: 'Schrödinger\'s Cat illustrates a paradox where a cat in a box is simultaneously alive and dead until observed, a macroscopic metaphor for quantum superposition.'
            }
        ]
    },
    { 
        id: 14, rarity: 'Legendary', author: 'Isaac Newton', title: 'Universal Gravitation', 
        equation: 'F = G * (m1 * m2) / r²', 
        text: 'Newton\'s law states that every particle attracts every other particle in the universe. This single equation explains why apples fall and why the moon orbits the Earth.',
        key: [
            { symbol: 'F', meaning: 'Force of gravity between two objects' },
            { symbol: 'G', meaning: 'Gravitational constant' },
            { symbol: 'm1 & m2', meaning: 'Masses of the two objects' },
            { symbol: 'r²', meaning: 'Square of the distance between their centers' }
        ],
        quizzes: [
            {
                question: 'What happens to the force of gravity if you double the distance (r) between two planets?',
                options: ['It cuts in half', 'It stays the same', 'It becomes 4 times weaker', 'It disappears entirely'],
                correctAnswerIndex: 2,
                explanation: 'Because distance (r) is squared and on the bottom of the fraction, doubling the distance makes the gravity 4 times weaker (1/2² = 1/4).'
            },
            {
                question: 'If you double the mass of BOTH planets (m1 and m2), what happens to the gravity?',
                options: ['It doubles', 'It quadruples (x4)', 'It halves', 'It stays the same'],
                correctAnswerIndex: 1,
                explanation: 'Because you are multiplying m1 * m2 on the top of the fraction, doubling both of them (2m1 * 2m2) equals 4 * (m1*m2), so gravity quadruples!'
            }
        ]
    },
    { 
        id: 19, rarity: 'Legendary', author: 'James Clerk Maxwell', title: 'Maxwell\'s Equations', 
        equation: '∇ × E = -∂B/∂t', 
        text: 'A set of partial differential equations that totally unified electricity and magnetism into a single force: Electromagnetism. It forms the basis of all modern electronics.',
        key: [
            { symbol: '∇ × E', meaning: 'The curl (rotation) of the electric field' },
            { symbol: 'B', meaning: 'The magnetic field' },
            { symbol: 't', meaning: 'Time' }
        ],
        quizzes: [
            {
                question: 'According to this specific equation (Faraday\'s law), what happens if you change a magnetic field over time?',
                options: ['It creates gravity', 'It destroys energy', 'It creates an electric field', 'It creates matter'],
                correctAnswerIndex: 2,
                explanation: 'A changing magnetic field (-∂B/∂t) induces a circulating electric field (∇ × E). This exact principle is how every power plant on Earth generates electricity!'
            },
            {
                question: 'Maxwell mathematically proved that electromagnetic waves travel at what speed?',
                options: ['The speed of sound', 'The speed of light', 'Instantaneously', 'The speed of Earth\'s rotation'],
                correctAnswerIndex: 1,
                explanation: 'Maxwell\'s equations proved that light itself is just a wave of electricity and magnetism traveling together!'
            }
        ]
    },
    { 
        id: 20, rarity: 'Legendary', author: 'Claude Navier & George Stokes', title: 'Navier-Stokes Equations', 
        equation: 'ρ(∂v/∂t + v·∇v) = -∇p + μ∇²v + f', 
        text: 'These equations describe the motion of viscous fluid substances. They are notoriously complex and are used to model ocean currents, weather, and aerodynamics.',
        key: [
            { symbol: 'v', meaning: 'Flow velocity' },
            { symbol: 'p', meaning: 'Fluid pressure' },
            { symbol: 'μ', meaning: 'Fluid viscosity (thickness)' },
            { symbol: 'f', meaning: 'External forces like gravity' }
        ],
        quizzes: [
            {
                question: 'Which of these cannot be modeled using the Navier-Stokes equations?',
                options: ['Air flowing over an airplane wing', 'Water flowing through a pipe', 'Blood pumping through veins', 'Light bending through a prism'],
                correctAnswerIndex: 3,
                explanation: 'Navier-Stokes is strictly for fluids (liquids and gases). Light is an electromagnetic wave, which is modeled by Maxwell\'s Equations!'
            },
            {
                question: 'The Navier-Stokes equations are considered one of the Millennium Prize Problems. What do you get if you fully solve their mathematical properties?',
                options: ['A Nobel Prize', 'One Million Dollars', 'A Fields Medal', 'A guaranteed job at NASA'],
                correctAnswerIndex: 1,
                explanation: 'The Clay Mathematics Institute offers $1,000,000 to anyone who can prove mathematically that smooth, predictable solutions always exist for these equations!'
            }
        ]
    }
];

export const rollGacha = (unlockedIds) => {
    // Filter out facts the user already has
    const availableFacts = MathFactDB.filter(fact => !unlockedIds.includes(fact.id));
    
    if (availableFacts.length === 0) return null; // Fully complete!

    const roll = Math.random() * 100;
    let targetRarity = 'Common';
    
    if (roll > 95) targetRarity = 'Legendary'; // 5%
    else if (roll > 80) targetRarity = 'Epic'; // 15%
    else if (roll > 50) targetRarity = 'Rare'; // 30%
    
    // Get facts of the rolled rarity that aren't unlocked
    let possibleDrops = availableFacts.filter(fact => fact.rarity === targetRarity);
    
    // If the user rolled a rarity they already completed, fallback to any available fact
    if (possibleDrops.length === 0) {
        possibleDrops = availableFacts;
    }
    
    return possibleDrops[Math.floor(Math.random() * possibleDrops.length)];
};
