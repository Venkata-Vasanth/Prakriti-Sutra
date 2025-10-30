/**
 * js/data.js
 * Contains static data for Dosha profiles and recommendations.
 * NOTE: This file must be linked in the <head> before script.js in dashboard.html.
 */

const DOSHA_PROFILES = {
    Vata: {
        color: '#3498db', // Light Blue
        summary: "Vata is characterized by the elements of Air and Ether. You are creative, quick-thinking, and lively, but prone to anxiety, restlessness, and dry skin. Vata needs grounding, warmth, and routine.",
        diet: [
            "Focus on warm, cooked, heavy, and moist foods (stews, soups, warm milk).",
            "Reduce cold, dry, raw, and light foods (salads, crackers).",
            "Favor sweet, sour, and salty tastes to stabilize energy.",
            "Eat at regular times and chew slowly."
        ],
        lifestyle: [
            "Establish a strict daily routine (Dincharya) for meals and sleep.",
            "Practice Abhyanga (warm oil self-massage) daily to moisturize and calm the nervous system.",
            "Keep warm and avoid exposure to cold winds.",
            "Limit excessive travel and stimulation."
        ],
        stress: [
            "Practice calming activities like meditation, deep belly breathing, and restorative yoga.",
            "Spend time in quiet environments.",
            "Use warming, grounding essential oils (sandalwood, lavender)."
        ],
    },
    Pitta: {
        color: '#e74c3c', // Red/Orange
        summary: "Pitta is characterized by the elements of Fire and Water. You are sharp, intelligent, ambitious, and driven, but prone to impatience, anger, and heat-related issues like inflammation. Pitta needs cooling, moderation, and release.",
        diet: [
            "Focus on cool, refreshing, and slightly dry foods (salads, fresh fruits, vegetables).",
            "Reduce hot, spicy, oily, and acidic foods (chili, coffee, red meat).",
            "Favor sweet, bitter, and astringent tastes.",
            "Eat when hungry but avoid skipping meals."
        ],
        lifestyle: [
            "Engage in moderately competitive physical activity (swimming, cycling) during the coolest parts of the day.",
            "Avoid excessive sun exposure and steam rooms.",
            "Ensure moderate work hours and schedule regular breaks to prevent burnout.",
            "Prioritize play and fun over constant work."
        ],
        stress: [
            "Practice cooling and non-competitive exercises.",
            "Use cooling scents like rose, mint, and jasmine.",
            "Meditate on compassion and non-judgment to release intensity."
        ],
    },
    Kapha: {
        color: '#2ecc71', // Green
        summary: "Kapha is characterized by the elements of Earth and Water. You are calm, steady, nurturing, and possess great endurance, but prone to lethargy, weight gain, and attachment. Kapha needs stimulation, lightness, and movement.",
        diet: [
            "Focus on light, dry, and warm foods.",
            "Reduce heavy, sweet, oily, and cold dairy products.",
            "Favor pungent (spicy), bitter, and astringent tastes.",
            "Limit fluid intake and avoid overeating."
        ],
        lifestyle: [
            "Ensure regular and vigorous physical exercise (running, dancing) to counter inertia.",
            "Vary your routine to prevent stagnation; seek new experiences.",
            "Avoid daytime napping.",
            "Use stimulating dry brushing (Garshana) before showering."
        ],
        stress: [
            "Seek out mentally stimulating environments and conversation.",
            "Use stimulating, invigorating essential oils (eucalyptus, ginger).",
            "Practice deep breathing exercises to increase warmth and circulation."
        ],
    }
};
