'use client'

import Link from 'next/link'

export default function About() {
  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f5f5f5'}}>
      {/* Header */}
      <header style={{backgroundColor: '#008080', color: 'white', padding: '20px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1 style={{fontSize: '24px', fontWeight: 'bold'}}>Tbooke</h1>
          <nav>
            <Link href="/login" style={{color: 'white', marginLeft: '20px', textDecoration: 'underline'}}>Login</Link>
            <Link href="/register" style={{color: 'white', marginLeft: '20px', textDecoration: 'underline'}}>Register</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{backgroundColor: '#008080', color: 'white', padding: '60px 20px', textAlign: 'center'}}>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <h2 style={{fontSize: '36px', fontWeight: 'bold', marginBottom: '20px'}}>About Tbooke</h2>
          <p style={{fontSize: '18px', lineHeight: '1.6'}}>
            An Education-Centric Open Learning and Social Platform transforming how students, teachers, and institutions connect and learn.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main style={{maxWidth: '1000px', margin: '40px auto', padding: '0 20px'}}>
        <section style={{marginBottom: '40px'}}>
          <h3 style={{fontSize: '28px', color: '#008080', marginBottom: '20px'}}>Our Mission</h3>
          <p style={{lineHeight: '1.6', marginBottom: '20px'}}>
            Tbooke is dedicated to creating an inclusive, accessible, and innovative learning environment that empowers educators and learners to achieve their full potential. We believe that education should be without boundaries, and technology should enable rather than hinder the learning process.
          </p>
        </section>

        <section style={{marginBottom: '40px'}}>
          <h3 style={{fontSize: '28px', color: '#008080', marginBottom: '20px'}}>What We Offer</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px'}}>
            <div style={{backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
              <h4 style={{fontSize: '20px', color: '#008080', marginBottom: '15px'}}>Interactive Learning</h4>
              <p>Engaging courses, quizzes, and interactive content that makes learning enjoyable and effective.</p>
            </div>
            <div style={{backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
              <h4 style={{fontSize: '20px', color: '#008080', marginBottom: '15px'}}>Educator Tools</h4>
              <p>Comprehensive tools for teachers to create, manage, and deliver content to their students.</p>
            </div>
            <div style={{backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
              <h4 style={{fontSize: '20px', color: '#008080', marginBottom: '15px'}}>Social Learning</h4>
              <p>Connect with peers, join study groups, and participate in educational communities.</p>
            </div>
            <div style={{backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
              <h4 style={{fontSize: '20px', color: '#008080', marginBottom: '15px'}}>Progress Tracking</h4>
              <p>Monitor your learning journey with detailed analytics and progress reports.</p>
            </div>
          </div>
        </section>

        <section style={{marginBottom: '40px'}}>
          <h3 style={{fontSize: '28px', color: '#008080', marginBottom: '20px'}}>Our Story</h3>
          <p style={{lineHeight: '1.6', marginBottom: '20px'}}>
            Founded in 2023, Tbooke emerged from a simple idea: education should be accessible to everyone, everywhere. Our team of educators, developers, and designers came together to create a platform that breaks down the barriers to quality education.
          </p>
          <p style={{lineHeight: '1.6', marginBottom: '20px'}}>
            Today, Tbooke serves thousands of students and educators across multiple countries, providing them with the tools they need to succeed in their educational journeys.
          </p>
        </section>

        <section>
          <h3 style={{fontSize: '28px', color: '#008080', marginBottom: '20px'}}>Join Our Community</h3>
          <p style={{lineHeight: '1.6', marginBottom: '30px'}}>
            Whether you're a student looking to expand your knowledge, an educator seeking to share your expertise, or an institution wanting to enhance your digital learning capabilities, Tbooke has something for you.
          </p>
          <div style={{textAlign: 'center'}}>
            <Link href="/register" style={{display: 'inline-block', backgroundColor: '#50C490', color: 'white', padding: '15px 30px', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none', marginRight: '15px'}}>
              Get Started
            </Link>
            <Link href="/login" style={{display: 'inline-block', backgroundColor: '#008080', color: 'white', padding: '15px 30px', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none'}}>
              Login
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{backgroundColor: '#008080', color: 'white', padding: '30px 20px', textAlign: 'center'}}>
        <p>© 2023 Tbooke. All rights reserved.</p>
      </footer>
    </div>
  )
}