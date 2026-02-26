<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
    name: '',
    email: '',
    subject: '',
    message: ''
})

const isSubmitting = ref(false)
const submitStatus = ref(null)

async function handleSubmit() {
    isSubmitting.value = true
    submitStatus.value = null

    try {
        console.log('Contact form submitted:', form.value) //Form simulation (No real functionality)
        form.value = {
            name: '',
            email: '',
            subject: '',
            message: ''
        }

        submitStatus.value = 'success'

        setTimeout(() => {
            submitStatus.value = null
        }, 3000)
    } catch (error) {
        console.error('Error submitting form:', error)
        submitStatus.value = 'error'
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <main class="contact-bg">
        <div class="bg-blob bg-blob-left" />
        <div class="bg-blob bg-blob-right" />

        <div class="container">
            <div class="hero-section">
                <h1 class="contact-title">Get In Touch</h1>
                <p class="contact-subtitle">
                    Have questions or feedback? We'd love to hear from you. Our team typically responds within 24 hours.
                </p>
            </div>

            <div class="contact-wrapper">
                <div class="contact-form-section">
                    <form @submit.prevent="handleSubmit" class="contact-form">
                        <div class="form-group">
                            <label for="name" class="form-label">Full Name *</label>
                            <input id="name" v-model="form.name" type="text" class="form-input" placeholder="Your name"
                                required />
                        </div>

                        <div class="form-group">
                            <label for="email" class="form-label">Email Address *</label>
                            <input id="email" v-model="form.email" type="email" class="form-input"
                                placeholder="your.email@example.com" required />
                        </div>

                        <div class="form-group">
                            <label for="subject" class="form-label">Subject *</label>
                            <input id="subject" v-model="form.subject" type="text" class="form-input"
                                placeholder="How can we help?" required />
                        </div>

                        <div class="form-group">
                            <label for="message" class="form-label">Message *</label>
                            <textarea id="message" v-model="form.message" class="form-textarea"
                                placeholder="Tell us more about your inquiry..." rows="6" required></textarea>
                        </div>

                        <div v-if="submitStatus === 'success'" class="alert alert-success">
                            Thank you for your message! We'll get back to you soon.
                        </div>
                        <div v-if="submitStatus === 'error'" class="alert alert-error">
                            There was an error submitting your form. Please try again.
                        </div>

                        <button type="submit" class="submit-btn" :disabled="isSubmitting">
                            {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                        </button>
                    </form>
                </div>

                <div class="contact-info-section">
                    <div class="info-card">
                        <div class="info-icon">
                            <i class="bi bi-envelope-fill"></i>
                        </div>
                        <h3 class="info-title">Email</h3>
                        <p class="info-text">hello@hobbyinabox.com</p>
                    </div>

                    <div class="info-card">
                        <div class="info-icon">
                            <i class="bi bi-telephone-fill"></i>
                        </div>
                        <h3 class="info-title">Phone</h3>
                        <p class="info-text">+27 (0) 21 555 0100</p>
                    </div>

                    <div class="info-card">
                        <div class="info-icon">
                            <i class="bi bi-clock-fill"></i>
                        </div>
                        <h3 class="info-title">Business Hours</h3>
                        <p class="info-text">
                            Monday - Friday: 9:00 AM - 5:00 PM<br>
                            Saturday: 10:00 AM - 2:00 PM<br>
                            Sunday: Closed
                        </p>
                    </div>

                    <div class="info-card">
                        <div class="info-icon">
                            <i class="bi bi-geo-alt-fill"></i>
                        </div>
                        <h3 class="info-title">Location</h3>
                        <p class="info-text">
                            123 Hobby Street<br>
                            Cape Town, 8001<br>
                            South Africa
                        </p>
                    </div>
                </div>
            </div>

            <div class="back-section">
                <button class="back-btn" @click="router.back()">
                    ← Go Back
                </button>
            </div>
        </div>
    </main>
</template>

<style scoped>
.contact-bg {
    min-height: 100vh;
    background: linear-gradient(135deg, #F3E6D3 0%, #E8D5BE 100%);
    padding: 4rem 1rem;
    position: relative;
    overflow: hidden;
}

.bg-blob {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(80px);
    opacity: 0.05;
    background-color: #A95A1C;
}

.bg-blob-left {
    width: 18rem;
    height: 18rem;
    top: 5rem;
    left: 2.5rem;
}

.bg-blob-right {
    width: 24rem;
    height: 24rem;
    bottom: 5rem;
    right: 2.5rem;
    background-color: #C06A22;
}

.container {
    max-width: 1280px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    padding-top: 2rem;
}

.hero-section {
    text-align: center;
    margin-bottom: 3rem;
    animation: fadeUp 0.7s ease both;
}

.contact-title {
    font-size: clamp(2.5rem, 6vw, 3.75rem);
    font-weight: 800;
    color: #3E2A1B;
    margin: 0 0 1rem;
}

.contact-subtitle {
    font-size: 1.125rem;
    color: #5A3A22;
    max-width: 40rem;
    margin: 0 auto;
}

.contact-wrapper {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    margin-bottom: 3rem;
}

@media (min-width: 768px) {
    .contact-wrapper {
        grid-template-columns: 1.2fr 1fr;
    }
}

.contact-form-section {
    background: #fff;
    border-radius: 1.5rem;
    padding: 2.5rem;
    box-shadow: 0 6px 24px rgba(62, 42, 27, 0.1);
    animation: fadeUp 0.7s ease 0.1s both;
}

.contact-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-label {
    font-size: 0.95rem;
    font-weight: 600;
    color: #3E2A1B;
}

.form-input,
.form-textarea {
    padding: 0.875rem 1rem;
    border: 2px solid #E8D5BE;
    border-radius: 0.75rem;
    font-size: 1rem;
    font-family: inherit;
    color: #3E2A1B;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
    outline: none;
    border-color: #A95A1C;
    box-shadow: 0 0 0 3px rgba(169, 90, 28, 0.1);
}

.form-textarea {
    resize: vertical;
    min-height: 120px;
}

.alert {
    padding: 1rem;
    border-radius: 0.75rem;
    font-weight: 500;
}

.alert-success {
    background: #D4EDDA;
    color: #155724;
    border: 1px solid #C3E6CB;
}

.alert-error {
    background: #F8D7DA;
    color: #721C24;
    border: 1px solid #F5C6CB;
}

.submit-btn {
    width: 100%;
    padding: 1rem;
    border-radius: 999px;
    background: #3E2A1B;
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
    background: #5A3A22;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(62, 42, 27, 0.3);
}

.submit-btn:active:not(:disabled) {
    transform: translateY(0);
}

.submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.contact-info-section {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    animation: fadeUp 0.7s ease 0.2s both;
}

@media (min-width: 768px) {
    .contact-info-section {
        grid-template-columns: 1fr 1fr;
    }
}

.info-card {
    background: #fff;
    border-radius: 1.5rem;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 6px 24px rgba(62, 42, 27, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(62, 42, 27, 0.15);
}

.info-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.info-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #3E2A1B;
    margin: 0 0 0.75rem;
}

.info-text {
    color: #5A3A22;
    margin: 0;
    line-height: 1.6;
    font-size: 0.95rem;
}

.back-section {
    text-align: center;
    animation: fadeUp 0.7s ease 0.3s both;
}

.back-btn {
    padding: 0.75rem 2rem;
    border-radius: 999px;
    background: #3E2A1B;
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s ease;
}

.back-btn:hover {
    background: #5A3A22;
    transform: translateX(-4px);
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(24px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
