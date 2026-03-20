import { useRef, useCallback } from 'react'
import { motion } from 'motion/react'

interface SampleNotesProps {
  onSelect: (text: string) => void
  compact?: boolean
}

const samples: Record<string, string[]> = {
  '🧬 biology': [
    `Photosynthesis is the process by which green plants convert light energy into chemical energy. It occurs in the chloroplasts, specifically using chlorophyll. The process has two stages: light-dependent reactions (in thylakoid membranes) and the Calvin cycle (in the stroma). Water is split into oxygen and hydrogen. CO2 is fixed into glucose through carbon fixation. The overall equation: 6CO2 + 6H2O + light → C6H12O6 + 6O2. Factors affecting rate: light intensity, CO2 concentration, temperature. Photosystem I and II work together in the light reactions. ATP and NADPH are produced and used in the Calvin cycle.`,
    `Mitosis is the process of cell division that results in two genetically identical daughter cells. It consists of prophase, metaphase, anaphase, and telophase followed by cytokinesis. During prophase, chromatin condenses into chromosomes and the nuclear envelope breaks down. In metaphase, chromosomes align at the cell's equator. Anaphase separates sister chromatids to opposite poles. Telophase reforms nuclear envelopes around each set. Mitosis is essential for growth, repair, and asexual reproduction. The cell cycle includes interphase (G1, S, G2) where DNA replicates before mitosis begins.`,
    `DNA replication is semi-conservative — each new double helix contains one original and one new strand. Helicase unwinds the double helix at the replication fork. Primase adds RNA primers to start synthesis. DNA polymerase III adds nucleotides in the 5' to 3' direction. The leading strand is synthesized continuously; the lagging strand is made in Okazaki fragments. DNA ligase joins the fragments. Proofreading by polymerase reduces errors to about 1 in a billion. Telomerase extends telomeres in stem and germ cells to prevent chromosome shortening.`,
    `The immune system has two main branches: innate and adaptive immunity. Innate immunity provides immediate, non-specific defense through barriers (skin, mucous membranes), phagocytes (macrophages, neutrophils), and inflammation. Adaptive immunity is antigen-specific and develops memory. B cells produce antibodies (humoral immunity). T cells include helper T cells (CD4+) that coordinate responses and cytotoxic T cells (CD8+) that kill infected cells. Vaccines work by stimulating adaptive immunity without causing disease. Autoimmune disorders occur when the immune system attacks the body's own tissues.`,
  ],
  '💻 computer science': [
    `A binary search tree (BST) is a data structure where each node has at most two children. The left subtree contains only nodes with keys less than the parent. The right subtree contains only nodes with keys greater than the parent. Search, insert, and delete operations have O(log n) average time complexity. In the worst case (unbalanced tree), operations degrade to O(n). Balanced BSTs like AVL trees and Red-Black trees maintain O(log n) guarantees. In-order traversal of a BST produces sorted output. BSTs are used in databases, file systems, and symbol tables.`,
    `TCP/IP is the foundational protocol suite of the internet. TCP (Transmission Control Protocol) provides reliable, ordered, error-checked delivery of data. It uses a three-way handshake (SYN, SYN-ACK, ACK) to establish connections. IP (Internet Protocol) handles addressing and routing packets across networks. IPv4 uses 32-bit addresses; IPv6 uses 128-bit addresses. UDP is a connectionless alternative to TCP — faster but unreliable. DNS translates domain names to IP addresses. HTTP operates on top of TCP at the application layer. Ports identify specific services (80 for HTTP, 443 for HTTPS).`,
    `Dynamic programming solves complex problems by breaking them into overlapping subproblems. It stores results of subproblems to avoid redundant computation (memoization or tabulation). Key properties: optimal substructure and overlapping subproblems. Classic examples include Fibonacci sequence, knapsack problem, longest common subsequence, and shortest path algorithms. Top-down approach uses recursion with memoization. Bottom-up approach fills a table iteratively. Time complexity often improves from exponential to polynomial. Bellman-Ford and Floyd-Warshall are DP-based graph algorithms.`,
    `Operating systems manage hardware resources and provide services to applications. The kernel is the core — it handles process scheduling, memory management, and I/O. Processes are isolated units of execution; threads share memory within a process. Virtual memory maps logical addresses to physical, enabling more memory than physically available. Page faults occur when accessed pages aren't in RAM. Scheduling algorithms include round-robin, priority-based, and multilevel feedback queues. Deadlocks happen when processes wait circularly for resources. Semaphores and mutexes prevent race conditions in concurrent programs.`,
  ],
  '🏛️ history': [
    `The French Revolution (1789-1799) was a period of radical political and societal change in France. Key causes: financial crisis, social inequality under the Estates system, Enlightenment ideas. Major events: Storming of the Bastille (July 14, 1789), Declaration of the Rights of Man, Reign of Terror under Robespierre, rise of Napoleon Bonaparte. The revolution abolished feudalism and the monarchy, established a republic, and introduced principles of citizenship and rights. It influenced democratic movements worldwide and led to the Napoleonic Wars.`,
    `The Industrial Revolution (1760-1840) transformed Britain from an agrarian society to an industrial powerhouse. Key innovations: spinning jenny, water frame, steam engine (James Watt), power loom. Factory systems replaced cottage industries, driving urbanization. Coal and iron became critical resources. Transportation revolutionized by railways and canals. Social impacts included child labor, poor working conditions, and the rise of a new middle class. The Luddite movement opposed mechanization. Trade unions emerged to protect workers' rights. The revolution spread to Europe, America, and eventually the world.`,
    `The Cold War (1947-1991) was a geopolitical rivalry between the United States and Soviet Union. It began after WWII with ideological conflict: capitalism vs communism. Key events: Berlin Blockade (1948), Korean War (1950-53), Cuban Missile Crisis (1962), Vietnam War, Space Race. NATO and the Warsaw Pact divided Europe. The arms race produced massive nuclear arsenals and the doctrine of Mutually Assured Destruction (MAD). Proxy wars were fought across Asia, Africa, and Latin America. Détente in the 1970s eased tensions temporarily. The fall of the Berlin Wall (1989) and Soviet dissolution (1991) ended the conflict.`,
    `Ancient Rome evolved from a kingdom (753 BC) to a republic (509 BC) to an empire (27 BC). The Republic featured a Senate, consuls, and popular assemblies. Expansion through military conquest brought wealth but also social tensions — the Gracchi reforms, Marius' military reforms, and civil wars between Sulla, Pompey, and Caesar. Augustus established the Principate after defeating Antony. The Pax Romana (27 BC-180 AD) brought stability and prosperity. Roman law, engineering (aqueducts, roads, Colosseum), and Latin language shaped Western civilization. The empire split in 285 AD and the Western half fell in 476 AD.`,
  ],
  '⚛️ physics': [
    `Newton's three laws of motion form the foundation of classical mechanics. First law (inertia): an object at rest stays at rest, an object in motion stays in motion unless acted on by a net external force. Second law: F = ma — force equals mass times acceleration. Third law: for every action there is an equal and opposite reaction. Weight is the gravitational force on an object (W = mg). Friction opposes motion and depends on the normal force and coefficient of friction. Free body diagrams help analyze forces. These laws break down at very high speeds (relativity) or very small scales (quantum mechanics).`,
    `Thermodynamics governs energy transfer and transformation. The zeroth law establishes thermal equilibrium and temperature. First law: energy is conserved — ΔU = Q - W (internal energy change equals heat added minus work done). Second law: entropy of an isolated system never decreases; heat flows from hot to cold spontaneously. Third law: entropy approaches zero as temperature approaches absolute zero. Carnot efficiency sets the maximum efficiency of heat engines: η = 1 - Tc/Th. Entropy measures disorder. Reversible processes are idealizations; real processes are irreversible and increase total entropy.`,
    `Electromagnetic waves are oscillating electric and magnetic fields that propagate through space at the speed of light (c ≈ 3×10⁸ m/s). Maxwell's equations unify electricity, magnetism, and optics. The electromagnetic spectrum ranges from radio waves (long wavelength) to gamma rays (short wavelength). Visible light occupies a narrow band (400-700 nm). Wave properties include reflection, refraction (Snell's law), diffraction, and interference. Photons are the quantum of EM radiation with energy E = hf. Polarization shows the transverse nature of EM waves. Applications span communications, medicine, astronomy, and technology.`,
  ],
  '📐 mathematics': [
    `Calculus studies rates of change (derivatives) and accumulation (integrals). The derivative f'(x) gives the slope of f(x) at any point. Basic rules: power rule (d/dx xⁿ = nxⁿ⁻¹), product rule, quotient rule, chain rule. The integral ∫f(x)dx reverses differentiation. The Fundamental Theorem of Calculus links derivatives and integrals. Definite integrals compute areas under curves. Applications include velocity/acceleration, optimization problems, and modeling growth. L'Hôpital's rule resolves indeterminate forms. Taylor series approximate functions as infinite polynomials. Multivariable calculus extends to partial derivatives and multiple integrals.`,
    `Linear algebra studies vectors, matrices, and linear transformations. A vector space is a set with addition and scalar multiplication satisfying axioms. Matrices represent linear maps; multiplication corresponds to composition. The determinant measures scaling factor — if zero, the matrix is singular (non-invertible). Eigenvalues λ satisfy Av = λv; eigenvectors define invariant directions. Row reduction (Gaussian elimination) solves systems of linear equations. Rank determines the dimension of the column space. The spectral theorem states symmetric matrices have orthogonal eigenvectors. Applications: computer graphics, machine learning, quantum mechanics, network analysis.`,
    `Probability theory quantifies uncertainty. The probability of event A is P(A) ∈ [0,1]. Complementary events: P(A') = 1 - P(A). For independent events: P(A∩B) = P(A)·P(B). Bayes' theorem: P(A|B) = P(B|A)·P(A)/P(B). Random variables map outcomes to numbers. Expected value E[X] = Σ xᵢP(xᵢ). Variance measures spread: Var(X) = E[(X-μ)²]. The normal distribution is bell-shaped with 68-95-99.7 rule. The central limit theorem states sample means approach normal distribution regardless of population shape. Law of large numbers: sample averages converge to expected value.`,
  ],
  '🧪 chemistry': [
    `Chemical bonding determines molecular structure and properties. Ionic bonds form between metals and non-metals through electron transfer — Na⁺Cl⁻. Covalent bonds share electrons — H₂O has two O-H bonds. Metallic bonds create a sea of delocalized electrons explaining conductivity. VSEPR theory predicts molecular geometry from electron pair repulsion. Electronegativity differences determine bond polarity. Hybridization (sp, sp², sp³) explains bond angles — methane is tetrahedral (109.5°), ethylene is trigonal planar (120°). Intermolecular forces (London dispersion, dipole-dipole, hydrogen bonding) affect boiling points and solubility.`,
    `Organic chemistry studies carbon-containing compounds. Carbon forms four bonds and chains/rings of variable length. Functional groups determine reactivity: -OH (alcohol), -COOH (carboxylic acid), -NH₂ (amine), C=O (carbonyl). Hydrocarbons: alkanes (single bonds), alkenes (double bonds), alkynes (triple bonds). Isomers have the same formula but different structures. Stereoisomers include enantiomers (mirror images) and diastereomers. Reaction types: substitution, addition, elimination, condensation. Polymers form through addition or condensation polymerization. Organic molecules are the basis of biochemistry — proteins, carbohydrates, lipids, nucleic acids.`,
  ],
}

const labels = Object.keys(samples)

export function SampleNotes({ onSelect, compact }: SampleNotesProps) {
  const indexRef = useRef<Record<string, number>>({})

  const handleClick = useCallback(
    (label: string) => {
      const pool = samples[label]
      const current = indexRef.current[label] ?? 0
      onSelect(pool[current % pool.length])
      indexRef.current[label] = current + 1
    },
    [onSelect],
  )

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-surface-500 uppercase tracking-wider font-bold font-display shrink-0">Samples</span>
        {labels.map((label) => {
          const [emoji, ...rest] = label.split(' ')
          const name = rest.join(' ')
          return (
            <button
              key={label}
              onClick={() => handleClick(label)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] text-surface-500 border border-surface-300 hover:border-surface-400 hover:text-surface-700 transition-all font-modern lowercase"
            >
              <span className="text-xs">{emoji}</span>
              {name}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <p className="text-[11px] font-modern text-surface-500 uppercase tracking-[0.12em] mb-3">
        or try with sample notes
      </p>
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => {
          const [emoji, ...rest] = label.split(' ')
          const name = rest.join(' ')
          return (
            <button
              key={label}
              onClick={() => handleClick(label)}
              className="flex items-center gap-2 px-4 py-2.5 border border-surface-300 text-[13px] font-modern tracking-[0.04em] lowercase text-surface-700 hover:bg-surface-100 hover:text-surface-900 transition-all duration-200"
            >
              <span className="text-base">{emoji}</span>
              {name}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
