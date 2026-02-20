import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────────────────
   Mairu Bistro — Menu Section
   Real data extracted from printed menu images.
   Hover interaction: floating cursor-following preview image.
   Mobile: tap to reveal / dismiss.
───────────────────────────────────────────────────────────────────────────── */

/*
 * Image map — keys match dish names (or category fallbacks).
 * Real Mairu Bistro ambiance photos grouped by visual mood / food type.
 * When dish AI images are generated, simply update the path here.
 */
const IMG = {
    // Coffee & hot drinks
    coffee: '/ambiance-indoor.webp',
    cappuccino: '/ambiance-indoor.webp',
    latte: '/ambiance-indoor.webp',
    tea: '/ambiance-evening.webp',

    // Fresh food + starters
    food: '/ambiance-day.webp',
    salad: '/ambiance-day.webp',
    soup: '/ambiance-indoor.webp',
    toast: '/ambiance-day.webp',
    pizza: '/ambiance-day.webp',
    pasta: '/ambiance-indoor.webp',

    // Drinks
    mojito: '/ambiance-evening.webp',
    shake: '/ambiance-evening.webp',
    juice: '/ambiance-day.webp',
    matcha: '/ambiance-indoor.webp',

    // fallback
    default: '/ambiance-day.webp',
};

/* Choose best image for an item — keyword match on name */
function pickImage(itemName, categoryId) {
    const n = itemName.toLowerCase();
    if (n.includes('espresso') || n.includes('cappuccino') || n.includes('latte') || n.includes('cortado') || n.includes('americano') || n.includes('macchiato') || n.includes('mocha') || n.includes('flat white') || n.includes('piccolo')) return IMG.cappuccino;
    if (n.includes('matcha')) return IMG.matcha;
    if (n.includes('tea') || n.includes('kahwa') || n.includes('hibiscus') || n.includes('chamomile') || n.includes('peppermint')) return IMG.tea;
    if (n.includes('mojito')) return IMG.mojito;
    if (n.includes('shake') || n.includes('smoothie') || n.includes('biscoff') || n.includes('oreo') || n.includes('vanilla') || n.includes('chocolate')) return IMG.shake;
    if (n.includes('juice') || n.includes('watermelon') || n.includes('pomegranate') || n.includes('orange') || n.includes('apple')) return IMG.juice;
    if (n.includes('salad') || n.includes('caesar') || n.includes('mediterranean') || n.includes('mexican')) return IMG.salad;
    if (n.includes('soup') || n.includes('mushroom') || n.includes('dumpling')) return IMG.soup;
    if (n.includes('toast') || n.includes('avocado')) return IMG.toast;
    if (n.includes('pizza') || n.includes('margherita')) return IMG.pizza;
    if (n.includes('pasta') || n.includes('penne') || n.includes('spaghetti') || n.includes('aglio') || n.includes('alfredo') || n.includes('tortellini')) return IMG.pasta;
    // category fallback
    if (categoryId === 'coffee') return IMG.coffee;
    if (categoryId === 'beverages' || categoryId === 'shakes') return IMG.mojito;
    return IMG[categoryId] || IMG.default;
}

/* ─── Full menu data ─────────────────────────────────────────────────────── */
export const MENU = {
    coffee: {
        label: 'Coffee',
        subtitle: 'Expertly brewed, lovingly served',
        items: [
            { name: 'Espresso', desc: 'A rich & aromatic caffeine shot.', price: '195 / 235', note: 'Single / Double' },
            { name: 'Macchiato', desc: 'Espresso topped with milk froth.', price: '245 / 275', note: 'Single / Double' },
            { name: 'Piccolo', desc: 'Single espresso and double milk.', price: '255' },
            { name: 'Cortado', desc: 'Equal parts espresso and steamed milk with froth.', price: '245' },
            { name: 'Americano', desc: 'Regular black coffee with hot water.', price: '245' },
            { name: 'Cappuccino', desc: 'A velvety treat of espresso, milk & milk froth.', price: '325' },
            { name: 'Latte', desc: 'Espresso with steamed milk, topped with velvety foam.', price: '325' },
            { name: 'Spanish Latte', desc: 'Espresso-based, sweetened with condensed milk.', price: '365' },
            { name: 'Affogato', desc: 'Espresso topped with vanilla ice cream.', price: '335 / 355', note: 'Single / Double' },
            { name: 'Café Mocha', desc: 'Espresso with chocolate & milk.', price: '345' },
            { name: 'Flat White', desc: 'Triple espresso with velvety foam.', price: '325' },
            { name: 'Iced Americano', desc: 'Espresso with iced water.', price: '245' },
            { name: 'Iced Latte', desc: 'Espresso with milk & ice.', price: '315' },
            { name: 'Mairu Iced Mocha', desc: 'Espresso with chocolate & cold milk.', price: '335' },
            { name: 'Cold Coffee', desc: 'Espresso blended with vanilla ice cream & milk.', price: '355' },
        ],
        sideNote: 'Oat Milk +₹95 · Almond Milk +₹95 · Extra Shot +₹95 · Flavour Syrups (Hazelnut / Vanilla / Caramel) +₹65',
    },
    food: {
        label: 'Starters',
        subtitle: 'Small plates, bold flavours',
        items: [
            { name: 'Black Eyed Nachos & Sour Cream', desc: 'Beans, melted cheese, served with salsa.', price: '545', tag: 'veg' },
            { name: 'Honey Chilli Potato', desc: 'Deep-fried potato in honey chilli sauce, topped with sesame seeds.', price: '495', tag: 'veg' },
            { name: 'Asian Chilli Paneer', desc: 'Crispy spiced paneer in homemade special sauce.', price: '555', tag: 'veg' },
            { name: 'Korean Paneer Bao', desc: 'Steam bun with crispy fried paneer, soya sauce, sesame seeds & scallions.', price: '555', tag: 'veg' },
            { name: 'Hummus Bites', desc: 'Crispy tortilla, creamy hummus, basil & olive oil.', price: '495', tag: 'veg' },
            { name: 'Darjeeling Paneer Kurkure Momos', desc: 'Crunchy outside, juicy inside, spicy momo sauce.', price: '525', tag: 'veg' },
            { name: 'Crunchy Quesadillas (Veg)', desc: 'Flour tortilla, spicy paneer & cheese, sour cream & salsa.', price: '555', tag: 'veg' },
            { name: 'Crunchy Quesadillas (Chicken)', desc: 'Flour tortilla, chicken, cucumber mint sour cream & salad.', price: '575', tag: 'non-veg' },
            { name: 'Bang Bang Chicken Skewers', desc: 'Chicken marinated in house spicy ranch dressing.', price: '595', tag: 'non-veg' },
            { name: 'Chicken 65', desc: 'Crispy fried chicken in house special sauce, salad.', price: '575', tag: 'non-veg' },
            { name: 'Tawa Chicken with Malabar Paratha', desc: 'Bhuna chicken between crumbly soft malabar paratha.', price: '595', tag: 'non-veg' },
            { name: 'Fish & Chips', desc: 'Crispy panko fish, house special mayo.', price: '595', tag: 'non-veg' },
            { name: 'Bang Bang Prawns', desc: 'Crispy fried prawn in house special sauce.', price: '695', tag: 'non-veg' },
            { name: 'Gun Powder Chicken', desc: 'Crispy chicken fingers with hot garlic sauce & salad.', price: '645', tag: 'non-veg' },
        ],
    },
    mains: {
        label: 'Mains',
        subtitle: 'Soups, salads & hearty bowls',
        items: [
            { name: 'Wild Mushroom Creamy Paprika Soup', desc: 'Exotic mushroom purée, paprika & smoke pepper.', price: '455', tag: 'veg' },
            { name: 'Hot & Sour Homemade Dumpling Soup', desc: 'All-time favourite soup, choose your homemade dumpling.', price: '445', note: 'Veg / Chicken' },
            { name: 'Mairu Spl Lamb Shank Soup', desc: 'All spices, lamb shank, mutton keema broth.', price: '545', tag: 'non-veg' },
            { name: 'Marry Me Chicken Soup', desc: 'Creamy marry me chicken soup cooked with pulled chicken.', price: '475', tag: 'non-veg' },
            { name: 'Mediterranean Chicken Salad', desc: 'Grilled chicken, lettuce, orange, zucchini, spiced orange mustard dressing.', price: '555', tag: 'non-veg' },
            { name: 'Mexican Salad', desc: 'Iceberg lettuce, corn, jalapeños, olives, spicy chilli garlic mayo & cilantro.', price: '495 / 545', note: 'Veg / Chicken' },
            { name: 'Crispy Chicken Caesar Salad', desc: 'Crispy chicken, homemade Caesar dressing.', price: '545', tag: 'non-veg' },
            { name: 'Weight Loss Salad', desc: 'Chickpea, cucumber, bell peppers, arugula with kala channa hummus.', price: '495', tag: 'veg' },
            { name: 'Mairu Spl Watermelon & Feta', desc: 'Watermelon, avocado, quinoa, arugula, granola, feta cheese.', price: '495', tag: 'veg' },
            { name: 'Avocado Toast', desc: 'Grain toast, avocado, cherry tomato, feta, pomegranate & soft fried egg.', price: '495', tag: 'veg' },
            { name: 'Truffle Mushroom Pesto Toast', desc: 'Sourdough, mushrooms, onions, truffle, cheese.', price: '495', tag: 'veg' },
        ],
    },
    pizza: {
        label: 'Pizza & Pasta',
        subtitle: 'Thin crust perfection & house-made pasta',
        items: [
            { name: 'Queen of Margherita', desc: 'Pomodoro sauce, mozzarella, fresh basil.', price: '495 / 695', note: 'Slice / Regular' },
            { name: 'Loaded Exotic Pizza', desc: 'Pomodoro sauce, mozzarella, seasonal vegetables.', price: '525 / 725', note: 'Slice / Regular' },
            { name: 'Spicy Tawa Paneer Pizza', desc: 'Paprika paneer, tomato sauce, buffalo cheese, spicy onion, green chilli.', price: '545 / 745', note: 'Slice / Regular' },
            { name: 'Butter Chicken Pizza', desc: 'Buttery chicken, onion, green chilli, coriander, parmesan oil.', price: '555 / 755', note: 'Slice / Regular' },
            { name: 'Bang Bang Chicken Pizza', desc: 'Spicy chicken, buffalo cheese, jalapeño, onion, boiled egg.', price: '545 / 745', note: 'Slice / Regular' },
            { name: 'Arabic Lamb Keema Pizza', desc: 'Lamb keema, tomato sauce, mozzarella, coriander, cheese.', price: '655 / 855', note: 'Slice / Regular' },
            { name: 'Spinach & Mushroom Cheese Tortellini', desc: 'Stuffed tortellini in porcini mushroom sauce.', price: '565 / 595', note: 'Penne / Spaghetti' },
            { name: 'Penne Alfredo', desc: 'White sauce base. Veg & non-veg options available.', price: '545 / 595', note: 'Penne / Spaghetti' },
            { name: 'Penne Arrabbiata', desc: 'Red sauce base. Veg & non-veg options available.', price: '545 / 595', note: 'Penne / Spaghetti' },
            { name: 'Penne Pink Sauce', desc: 'Pink sauce base. Veg & non-veg options available.', price: '545 / 595', note: 'Penne / Spaghetti' },
            { name: 'Penne Aglio e Olio', desc: 'Garlic & oil base. Veg & non-veg options available.', price: '545 / 595', note: 'Penne / Spaghetti' },
        ],
    },
    beverages: {
        label: 'Beverages',
        subtitle: 'Crafted drinks for every mood',
        items: [
            { name: 'Lemon Mojito', desc: 'Crisp, refreshing, house classic.', price: '325', note: '85 kcal' },
            { name: 'Orange Mojito', desc: 'Fresh orange with classic mojito base.', price: '355', note: '115 kcal' },
            { name: 'Passion Fruit Mojito', desc: 'Tropical passion fruit mojito.', price: '355', note: '125 kcal' },
            { name: 'Pomegranate Mojito', desc: 'Bold pomegranate, fresh mint.', price: '355', note: '145 kcal' },
            { name: 'Berry Punch Smoothie', desc: 'Blueberry, raspberry, strawberry, honey, almond milk.', price: '445', note: '186 kcal' },
            { name: 'Avocado Smoothie', desc: 'Avocado, milk, yoghurt, vanilla syrup & honey.', price: '445', note: '337 kcal' },
            { name: 'Berry Banana Smoothie', desc: 'Refreshing strawberry purée, banana & yoghurt.', price: '445', note: '338 kcal' },
            { name: 'Pome Punch', desc: 'Pomegranate juice, apple juice, cranberry juice, triple sec.', price: '425', note: '110 kcal' },
            { name: 'Mairu Black Magic', desc: 'Fresh mint, lime, cucumber, jalapeño, mixed with soda.', price: '395', note: '120 kcal' },
            { name: 'Matchalatte', desc: 'Smooth and creamy unsweetened matcha with milk.', price: '385', note: '131 kcal' },
            { name: 'Iced Matcha Latte', desc: 'Chilled matcha, milk & honey over ice.', price: '365', note: '160 kcal' },
            { name: 'Iced Strawberry Matcha Latte', desc: 'Strawberry purée, matcha, milk, water over ice.', price: '425', note: '140 kcal' },
            { name: 'Hibiscus Tea', desc: 'Floral, naturally tart — served hot.', price: '345 / 455', note: 'Half / Full Port' },
            { name: 'Kashmiri Kahwa', desc: 'Traditional spiced green tea, served hot.', price: '345 / 455', note: 'Half / Full Port' },
        ],
    },
    shakes: {
        label: 'Shakes & Juices',
        subtitle: 'Pure, cold, crafted',
        items: [
            { name: 'Chocolate Shake', desc: 'Chocolate sauce, ice cream, milk, whipped cream, chocolate drizzle.', price: '375', note: '655 kcal' },
            { name: 'Vanilla Shake', desc: 'Classic creamy vanilla ice cream and milk.', price: '365', note: '470 kcal' },
            { name: 'Strawberry Shake', desc: 'Strawberry purée, ice cream & milk.', price: '375', note: '630 kcal' },
            { name: 'Lotus Biscoff Shake', desc: 'Biscuit, Biscoff, ice cream, milk.', price: '395', note: '445 kcal' },
            { name: 'Oreo Shake', desc: 'Ice cream, Oreo biscuit, chocolate, milk.', price: '385', note: '475 kcal' },
            { name: 'Mocha Shake', desc: 'Chocolate sauce, espresso, ice cream & milk.', price: '395', note: '730 kcal' },
            { name: 'Watermelon Juice', desc: 'Freshly pressed.', price: '295', note: '99 kcal' },
            { name: 'Pomegranate Juice', desc: 'Freshly pressed.', price: '365', note: '145 kcal' },
            { name: 'Orange Juice', desc: 'Freshly squeezed Valencia oranges.', price: '365', note: '150 kcal' },
            { name: 'Apple, Beet & Carrot', desc: 'Freshly pressed blend.', price: '325', note: '140 kcal' },
            { name: 'Lemon & Mint Iced Tea', desc: 'Refreshing house iced tea.', price: '325', note: '70 kcal' },
            { name: 'Peach Iced Tea', desc: 'Lightly sweetened peach cold brew.', price: '325', note: '145 kcal' },
            { name: 'Passion Fruit Iced Tea', desc: 'Tropical and bright.', price: '345', note: '130 kcal' },
        ],
    },
};

const CATEGORIES = Object.entries(MENU).map(([id, data]) => ({ id, label: data.label }));

/* ─── Cursor-following floating image ────────────────────────────────────── */
function FloatingImage({ src, visible }) {
    const cursorX = useMotionValue(-300);
    const cursorY = useMotionValue(-300);

    // Smooth spring physics — slow and elegant
    const springX = useSpring(cursorX, { stiffness: 65, damping: 22 });
    const springY = useSpring(cursorY, { stiffness: 65, damping: 22 });

    // Subtle tilt on X-axis based on cursor position (very gentle)
    const rotateY = useTransform(springX, [0, window.innerWidth], [-4, 4]);
    const rotateX = useTransform(springY, [0, window.innerHeight], [2, -2]);

    useEffect(() => {
        const move = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, [cursorX, cursorY]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    style={{
                        position: 'fixed',
                        left: springX,
                        top: springY,
                        translateX: '20px',
                        translateY: '-50%',
                        rotateY,
                        rotateX,
                        zIndex: 9000,
                        pointerEvents: 'none',
                        transformStyle: 'preserve-3d',
                    }}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Soft shadow base */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: '-8px',
                            background: 'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(46,43,40,0.22) 0%, transparent 70%)',
                            transform: 'translateY(12px) translateZ(-10px)',
                            filter: 'blur(12px)',
                        }}
                    />

                    {/* Image container */}
                    <motion.div
                        style={{
                            width: 240,
                            height: 300,
                            overflow: 'hidden',
                            border: '1px solid rgba(229,222,211,0.6)',
                        }}
                        layoutId="preview-img"
                    >
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={src}
                                src={src}
                                alt="Dish preview"
                                initial={{ opacity: 0, scale: 1.06 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.45, ease: 'easeInOut' }}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                            />
                        </AnimatePresence>

                        {/* Warm cream vignette overlay */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, rgba(247,243,238,0.35) 0%, transparent 50%)',
                                pointerEvents: 'none',
                            }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ─── Mobile tap preview ─────────────────────────────────────────────────── */
function MobilePreview({ src, name, onClose }) {
    return (
        <AnimatePresence>
            {src && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-[8000] flex items-end justify-center"
                    style={{ background: 'rgba(46,43,40,0.55)', backdropFilter: 'blur(8px)' }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full max-w-sm mx-4 mb-8 overflow-hidden"
                        style={{ border: '1px solid rgba(229,222,211,0.5)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <img
                            src={src}
                            alt={name}
                            style={{ width: '100%', height: 300, objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                        />
                        <div
                            style={{
                                background: 'rgba(247,243,238,0.98)',
                                padding: '1rem 1.25rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', color: '#2E2B28', fontWeight: 500 }}>
                                {name}
                            </p>
                            <button
                                onClick={onClose}
                                style={{ background: 'none', border: 'none', color: '#9A8E84', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer' }}
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ─── Veg/Non-veg tag dot ────────────────────────────────────────────────── */
function Tag({ type }) {
    if (!type || type === 'both') return null;
    return (
        <span
            className="inline-block w-[7px] h-[7px] rounded-full flex-shrink-0 mt-[7px]"
            title={type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
            style={{ background: type === 'veg' ? '#6A9E5F' : '#B85C38' }}
        />
    );
}

/* ─── Single menu item ───────────────────────────────────────────────────── */
function MenuItem({ item, index, categoryId, onHover, onLeave, onTap, isMobile }) {
    const [localHover, setLocalHover] = useState(false);
    const img = pickImage(item.name, categoryId);

    const handleEnter = useCallback(() => {
        setLocalHover(true);
        onHover(img, item.name);
    }, [img, item.name, onHover]);

    const handleLeave = useCallback(() => {
        setLocalHover(false);
        onLeave();
    }, [onLeave]);

    const handleTap = useCallback(() => {
        if (isMobile) onTap(img, item.name);
    }, [img, item.name, isMobile, onTap]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }} // reduced
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            onClick={handleTap}
            className="group"
            style={{ cursor: isMobile ? 'pointer' : 'none' }}
        >
            <div className="flex items-start justify-between gap-6 py-5">
                {/* Left */}
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <Tag type={item.tag} />
                    <div className="flex-1 min-w-0">
                        {/* Dish name — highlighted on hover */}
                        <h3
                            className="font-serif leading-snug mb-1 transition-colors duration-500"
                            style={{
                                color: localHover ? '#C8A96A' : '#2E2B28',
                                fontSize: '1rem',
                                fontWeight: 500,
                                letterSpacing: '-0.01em',
                            }}
                        >
                            {/* Subtle underline on hover */}
                            <span style={{ position: 'relative', display: 'inline' }}>
                                {item.name}
                                <motion.span
                                    style={{
                                        position: 'absolute',
                                        bottom: -1,
                                        left: 0,
                                        height: '1px',
                                        background: 'rgba(200,169,106,0.5)',
                                        scaleX: localHover ? 1 : 0,
                                        originX: 0,
                                        display: 'block',
                                        width: '100%',
                                    }}
                                    animate={{ scaleX: localHover ? 1 : 0 }}
                                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                />
                            </span>
                        </h3>

                        {item.desc && (
                            <p
                                className="text-[0.78rem] leading-relaxed font-light"
                                style={{ color: '#9A8E84', letterSpacing: '0.015em' }}
                            >
                                {item.desc}
                            </p>
                        )}
                        {item.note && (
                            <p className="text-[0.62rem] mt-1 tracking-wider" style={{ color: '#C8BEB4' }}>
                                {item.note}
                            </p>
                        )}
                    </div>
                </div>

                {/* Price — right aligned, gently glows on hover */}
                <div className="text-right flex-shrink-0 pt-0.5">
                    <motion.span
                        className="font-sans tabular-nums transition-colors duration-500"
                        style={{
                            fontSize: '0.8rem',
                            color: localHover ? '#C8A96A' : '#BFB49C',
                            letterSpacing: '0.02em',
                            fontWeight: 400,
                        }}
                    >
                        ₹{item.price}
                    </motion.span>
                </div>
            </div>

            {/* Thin divider */}
            <div style={{ height: '1px', background: localHover ? 'rgba(200,169,106,0.2)' : 'rgba(229,222,211,0.7)', transition: 'background 0.5s' }} />
        </motion.div>
    );
}

/* ─── Two-column menu grid ───────────────────────────────────────────────── */
function MenuGrid({ items, categoryId, onHover, onLeave, onTap, isMobile }) {
    const half = Math.ceil(items.length / 2);
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20">
            <div>
                {items.slice(0, half).map((item, i) => (
                    <MenuItem key={item.name} item={item} index={i} categoryId={categoryId}
                        onHover={onHover} onLeave={onLeave} onTap={onTap} isMobile={isMobile} />
                ))}
            </div>
            <div>
                {items.slice(half).map((item, i) => (
                    <MenuItem key={item.name} item={item} index={i + half} categoryId={categoryId}
                        onHover={onHover} onLeave={onLeave} onTap={onTap} isMobile={isMobile} />
                ))}
            </div>
        </div>
    );
}

/* ─── Main Menu Section ──────────────────────────────────────────────────── */
export default function Menu() {
    const [active, setActive] = useState('coffee');
    const [hoveredImg, setHoveredImg] = useState(null);
    const [hoveredName, setHoveredName] = useState('');
    const [mobilePreview, setMobilePreview] = useState({ src: null, name: '' });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.matchMedia('(pointer: coarse)').matches);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const section = MENU[active];

    const handleHover = useCallback((img, name) => {
        if (!isMobile) {
            setHoveredImg(img);
            setHoveredName(name);
        }
    }, [isMobile]);

    const handleLeave = useCallback(() => {
        if (!isMobile) setHoveredImg(null);
    }, [isMobile]);

    const handleTap = useCallback((img, name) => {
        setMobilePreview({ src: img, name });
    }, []);

    return (
        <section id="menu" className="section-cream overflow-hidden">
            {/* Global cursor-following preview (desktop) */}
            <FloatingImage src={hoveredImg} visible={!!hoveredImg && !isMobile} />

            {/* Mobile tap preview overlay */}
            <MobilePreview
                src={mobilePreview.src}
                name={mobilePreview.name}
                onClose={() => setMobilePreview({ src: null, name: '' })}
            />

            <div className="section-padding max-w-content mx-auto">

                {/* ── Section Header ── */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }} // reduced
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-5 mb-7"
                    >
                        <div className="gold-divider" />
                        <span className="eyebrow" style={{ color: '#C8A96A' }}>Mairu Bistro</span>
                        <div className="gold-divider" />
                    </motion.div>

                    <div className="overflow-hidden mb-4">
                        <motion.h2
                            initial={{ y: '100%' }} // Keep for mask
                            whileInView={{ y: '0%' }}
                            transition={{ duration: 1.6, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
                            viewport={{ once: true }}
                            className="font-serif text-display-md"
                            style={{ color: '#2E2B28', fontWeight: 400, letterSpacing: '-0.02em' }}
                        >
                            The Menu
                        </motion.h2>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.55 }}
                        viewport={{ once: true }}
                        className="font-display italic text-lg"
                        style={{ color: '#9A8E84', fontWeight: 300 }}
                    >
                        Every dish tells a story
                    </motion.p>

                    {/* Desktop hover hint */}
                    {!isMobile && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1.2, delay: 0.8 }}
                            viewport={{ once: true }}
                            className="mt-4 text-[0.58rem] tracking-wider"
                            style={{ color: '#D4C8BC' }}
                        >
                            Hover over any dish to preview
                        </motion.p>
                    )}
                </div>

                {/* ── Category Tabs ── */}
                <motion.div
                    initial={{ opacity: 0, y: 6 }} // reduced
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.0, delay: 0.25 }}
                    viewport={{ once: true }}
                    className="flex items-end overflow-x-auto scrollbar-none mb-16"
                    style={{ borderBottom: '1px solid #E5DED3' }}
                >
                    {CATEGORIES.map((cat) => {
                        const isActive = active === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActive(cat.id)}
                                className="relative flex-shrink-0 px-6 py-4 group"
                                style={{ cursor: 'none', background: 'none', border: 'none' }}
                            >
                                <span
                                    className="eyebrow transition-colors duration-600"
                                    style={{
                                        fontSize: '0.57rem',
                                        color: isActive ? '#2E2B28' : '#C8BEB4',
                                        letterSpacing: '0.45em',
                                    }}
                                >
                                    {cat.label}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="tab-line"
                                        className="absolute bottom-0 left-0 right-0 h-px"
                                        style={{ background: '#C8A96A' }}
                                        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </motion.div>

                {/* ── Menu items ── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 10 }} // reduced
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }} // reduced
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Chapter heading */}
                        <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 mb-10 pb-6" style={{ borderBottom: '1px solid #E5DED3' }}>
                            <div>
                                <h3 className="font-serif text-[1.45rem] md:text-[1.65rem] mb-1" style={{ color: '#2E2B28', fontWeight: 400, letterSpacing: '-0.015em' }}>
                                    {section.label}
                                </h3>
                                <p className="font-display italic text-sm" style={{ color: '#B8AFA6', fontWeight: 300 }}>
                                    {section.subtitle}
                                </p>
                            </div>
                            {section.items.some(i => i.tag) && (
                                <div className="flex items-center gap-4 text-[0.6rem] tracking-wider" style={{ color: '#B8AFA6' }}>
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#6A9E5F', display: 'inline-block' }} /> Veg
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#B85C38', display: 'inline-block' }} /> Non-Veg
                                    </span>
                                </div>
                            )}
                        </div>

                        <MenuGrid
                            items={section.items}
                            categoryId={active}
                            onHover={handleHover}
                            onLeave={handleLeave}
                            onTap={handleTap}
                            isMobile={isMobile}
                        />

                        {section.sideNote && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mt-10 text-[0.65rem] leading-relaxed"
                                style={{ color: '#C8BEB4', borderTop: '1px solid #E5DED3', paddingTop: '1.5rem', letterSpacing: '0.04em' }}
                            >
                                {section.sideNote}
                            </motion.p>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* ── Footer note ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="mt-20 pt-8 text-center"
                    style={{ borderTop: '1px solid #E5DED3' }}
                >
                    <p className="text-[0.6rem] tracking-wider" style={{ color: '#C8BEB4' }}>
                        All prices in ₹ · Government taxes as applicable · 2000 kcal/day reference · Menu subject to seasonal availability
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
