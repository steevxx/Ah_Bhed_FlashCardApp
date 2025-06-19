// Al Bhed Quiz Application JavaScript

class AlBhedQuiz {
    constructor() {
        this.letters = [];
        this.currentIndex = 0;
        this.score = 0;
        this.initializeEventListeners();
        this.populateMapping();
    }

    initializeEventListeners() {
        // Start quiz button
        document.getElementById('start-quiz-btn').addEventListener('click', () => {
            this.startQuiz();
        });

        // Submit answer button
        document.getElementById('submit-answer-btn').addEventListener('click', () => {
            this.submitAnswer();
        });

        // Restart quiz button
        document.getElementById('restart-quiz-btn').addEventListener('click', () => {
            this.restartQuiz();
        });

        // View mapping button
        document.getElementById('view-mapping-btn').addEventListener('click', () => {
            const modal = new bootstrap.Modal(document.getElementById('mappingModal'));
            modal.show();
        });

        // Enter key submission
        document.getElementById('answer-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitAnswer();
            }
        });

        // Auto-focus and uppercase input
        document.getElementById('answer-input').addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
        });
    }

    async startQuiz() {
        try {
            const response = await fetch('/start_quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to start quiz');
            }

            const data = await response.json();
            this.letters = data.letters;
            this.currentIndex = 0;
            this.score = 0;
            
            this.showQuizScreen();
            this.updateCurrentQuestion();
        } catch (error) {
            console.error('Error starting quiz:', error);
            this.showError('Failed to start quiz. Please try again.');
        }
    }

    updateCurrentQuestion() {
        // Check if quiz is complete
        if (this.currentIndex >= this.letters.length) {
            this.showResults({
                final_score: this.score,
                total_questions: this.letters.length
            });
            return;
        }

        const currentLetter = this.letters[this.currentIndex];
        
        // Update question display
        document.getElementById('current-letter').textContent = currentLetter;
        
        // Update progress
        const progressPercent = ((this.currentIndex + 1) / this.letters.length) * 100;
        document.getElementById('progress-bar').style.width = progressPercent + '%';
        document.getElementById('progress-text').textContent = 
            `${this.currentIndex + 1} / ${this.letters.length}`;
        
        // Update score
        document.getElementById('current-score').textContent = this.score;
        
        // Focus on input
        document.getElementById('answer-input').focus();
    }

    async submitAnswer() {
        const answerInput = document.getElementById('answer-input');
        const answer = answerInput.value.trim();

        if (!answer) {
            answerInput.focus();
            return;
        }

        if (this.currentIndex >= this.letters.length) {
            return;
        }

        const currentLetter = this.letters[this.currentIndex];

        try {
            const response = await fetch('/check_answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    letter: currentLetter,
                    answer: answer 
                })
            });

            if (!response.ok) {
                throw new Error('Failed to check answer');
            }

            const data = await response.json();
            
            // Update score if correct
            if (data.correct) {
                this.score++;
            }

            this.showFeedback(data);

            // Move to next question
            this.currentIndex++;

            // Clear input and get next question after a delay
            answerInput.value = '';
            setTimeout(() => {
                this.hideFeedback();
                this.updateCurrentQuestion();
            }, 2000);

        } catch (error) {
            console.error('Error submitting answer:', error);
            this.showError('Failed to submit answer. Please try again.');
        }
    }

    showFeedback(data) {
        const feedbackDiv = document.getElementById('feedback');
        const feedbackMessage = document.getElementById('feedback-message');
        const alertDiv = feedbackDiv.querySelector('.alert');

        if (data.correct) {
            alertDiv.className = 'alert alert-success';
            feedbackMessage.innerHTML = `
                <i class="fas fa-check-circle me-2"></i>
                <strong>Correct!</strong> Well done.
            `;
        } else {
            alertDiv.className = 'alert alert-danger';
            feedbackMessage.innerHTML = `
                <i class="fas fa-times-circle me-2"></i>
                <strong>Oops!</strong> The correct answer was '<strong>${data.correct_answer}</strong>'.
            `;
        }

        feedbackDiv.classList.remove('d-none');
    }

    hideFeedback() {
        document.getElementById('feedback').classList.add('d-none');
    }

    showResults(data) {
        this.hideQuizScreen();
        
        // Update results
        document.getElementById('final-score').textContent = data.final_score;
        document.getElementById('total-questions').textContent = data.total_questions;
        
        // Show performance message
        const percentage = Math.round((data.final_score / data.total_questions) * 100);
        const performanceMessage = document.getElementById('performance-message');
        const resultsIcon = document.getElementById('results-icon');
        
        if (percentage === 100) {
            performanceMessage.innerHTML = `
                <div class="text-success">
                    <i class="fas fa-star me-1"></i>
                    Perfect score! You're an Al Bhed master!
                </div>
            `;
            resultsIcon.innerHTML = '<i class="fas fa-crown fa-4x text-warning"></i>';
        } else if (percentage >= 80) {
            performanceMessage.innerHTML = `
                <div class="text-info">
                    <i class="fas fa-thumbs-up me-1"></i>
                    Excellent work! ${percentage}% correct!
                </div>
            `;
        } else if (percentage >= 60) {
            performanceMessage.innerHTML = `
                <div class="text-warning">
                    <i class="fas fa-medal me-1"></i>
                    Good job! ${percentage}% correct!
                </div>
            `;
        } else {
            performanceMessage.innerHTML = `
                <div class="text-muted">
                    <i class="fas fa-book me-1"></i>
                    Keep practicing! ${percentage}% correct!
                </div>
            `;
            resultsIcon.innerHTML = '<i class="fas fa-book fa-4x text-info"></i>';
        }
        
        document.getElementById('results-screen').classList.remove('d-none');
    }

    async restartQuiz() {
        // Reset local state
        this.letters = [];
        this.currentIndex = 0;
        this.score = 0;

        // Reset UI
        this.hideResultsScreen();
        this.hideFeedback();
        document.getElementById('welcome-screen').classList.remove('d-none');
    }

    showQuizScreen() {
        document.getElementById('welcome-screen').classList.add('d-none');
        document.getElementById('quiz-screen').classList.remove('d-none');
    }

    hideQuizScreen() {
        document.getElementById('quiz-screen').classList.add('d-none');
    }

    hideResultsScreen() {
        document.getElementById('results-screen').classList.add('d-none');
    }

    showError(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show mt-3';
        alertDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.container').appendChild(alertDiv);
    }

    populateMapping() {
        // Al Bhed mapping for the modal table
        const mapping = {
            'A': 'Y', 'B': 'P', 'C': 'L', 'D': 'T', 'E': 'A', 'F': 'V', 'G': 'K',
            'H': 'R', 'I': 'E', 'J': 'Z', 'K': 'G', 'L': 'M', 'M': 'S', 'N': 'H',
            'O': 'U', 'P': 'B', 'Q': 'X', 'R': 'N', 'S': 'C', 'T': 'D', 'U': 'I',
            'V': 'J', 'W': 'F', 'X': 'Q', 'Y': 'O', 'Z': 'W'
        };

        const tableBody = document.getElementById('mapping-table-body');
        const letters = Object.keys(mapping);
        
        // Create rows with 2 mappings per row
        for (let i = 0; i < letters.length; i += 2) {
            const letter1 = letters[i];
            const letter2 = letters[i + 1];
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="fw-bold text-info">${letter1}</td>
                <td>${mapping[letter1]}</td>
                <td class="fw-bold text-info">${letter2 || ''}</td>
                <td>${letter2 ? mapping[letter2] : ''}</td>
            `;
            tableBody.appendChild(row);
        }
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AlBhedQuiz();
});
