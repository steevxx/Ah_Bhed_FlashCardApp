import os
import random
from flask import Flask, render_template, request, session, jsonify

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_secret_key_12345")

# Simplified session settings for better compatibility
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_HTTPONLY'] = False  # Allow JavaScript access for debugging
app.config['SESSION_COOKIE_SAMESITE'] = None  # Most permissive for compatibility

# Al Bhed mapping using the exact data from the provided script
AL_BHED_MAPPING = {
    'A': 'Y', 'B': 'P', 'C': 'L', 'D': 'T', 'E': 'A', 'F': 'V', 'G': 'K',
    'H': 'R', 'I': 'E', 'J': 'Z', 'K': 'G', 'L': 'M', 'M': 'S', 'N': 'H',
    'O': 'U', 'P': 'B', 'Q': 'X', 'R': 'N', 'S': 'C', 'T': 'D', 'U': 'I',
    'V': 'J', 'W': 'F', 'X': 'Q', 'Y': 'O', 'Z': 'W'
}

@app.before_request
def before_request():
    """Ensure session is properly initialized"""
    if not hasattr(session, 'permanent'):
        session.permanent = True

@app.route('/')
def index():
    """Main page - start or continue quiz"""
    return render_template('index.html')

@app.route('/start_quiz', methods=['POST'])
def start_quiz():
    """Generate a new shuffled quiz"""
    data = request.get_json() or {}
    mode = data.get('mode', 'english_to_albhed')
    
    if mode == 'albhed_to_english':
        # For Al Bhed to English, we show Al Bhed letters
        letters = list(AL_BHED_MAPPING.values())
    else:
        # For English to Al Bhed, we show English letters
        letters = list(AL_BHED_MAPPING.keys())
    
    random.shuffle(letters)
    
    return jsonify({
        'letters': letters,
        'success': True
    })

@app.route('/check_answer', methods=['POST'])
def check_answer():
    """Check if an answer is correct"""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    question_letter = data.get('letter', '').strip().upper()
    user_answer = data.get('answer', '').strip().upper()
    mode = data.get('mode', 'english_to_albhed')
    
    if mode == 'albhed_to_english':
        # Question is Al Bhed letter, answer should be English
        # Find the English letter for this Al Bhed letter
        english_letter = None
        for eng, albhed in AL_BHED_MAPPING.items():
            if albhed == question_letter:
                english_letter = eng
                break
        
        if not english_letter:
            return jsonify({'error': 'Invalid Al Bhed letter'}), 400
        
        correct_answer = english_letter
        is_correct = user_answer == correct_answer
        
        return jsonify({
            'correct': is_correct,
            'correct_answer': correct_answer,
            'question_letter': question_letter
        })
    else:
        # Question is English letter, answer should be Al Bhed
        if not question_letter or question_letter not in AL_BHED_MAPPING:
            return jsonify({'error': 'Invalid English letter'}), 400
        
        correct_answer = AL_BHED_MAPPING[question_letter]
        is_correct = user_answer == correct_answer
        
        return jsonify({
            'correct': is_correct,
            'correct_answer': correct_answer,
            'question_letter': question_letter
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
