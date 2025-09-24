import headshot from '../assets/kara-headshot1.jpeg'

function About() {
    return (
        <main className='About-container'>
            <div className='About-top-container'>
                <img className='About-image' src={headshot} alt='tf mortgage services' />


                <div className='About-top-section'>
                    <p className='About-top-title'>Kara Bazemore</p>
                    <p className='About-title'>
                        Licensed Massage Therapist
                    </p>

                    <p className='About-content'>
                        I spent years teaching students how to understand the complexities of economics. Today, I bring that same passion for clear, empowering guidance to the mortgage world. Whether you're buying your first home, co-purchasing with a loved one, or exploring a reverse mortgage, I’m here to make the process easier, clearer, and a whole lot less intimidating.
                    </p>

                </div>
            </div>
            <div className='About-lower-container'>
                <div className='About-section About-section-odd'>
                    <p className='About-title'>

                        Why I Do This Work
                    </p>
                    <p className='About-content'>

                        Too many people feel overwhelmed—or worse, misled—when it comes to financing a home. I believe everyone deserves to understand what they're signing up for. That’s why I take the time to explain your options in everyday language, answer your questions thoroughly, and help you make confident, well-informed decisions.
                    </p>
                    <p className='About-content'>

                        I also believe deeply in the power of homeownership. It’s not just about a roof over your head—it’s about stability, opportunity, and building a future. I’m committed to helping make that possibility accessible for everyone, regardless of their starting point.
                    </p>
                </div>
                <div className='About-section About-section-even'>

                    <p className='About-title'>

                        My Personal Journey
                    </p>
                    <p className='About-content'>

                        I’ve moved several times myself—twice buying homes with my former husband, then renting for a few years before purchasing a home on my own to raise my three children. Now that they’re growing up and becoming more independent, I’m looking to downsize or create shared ownership opportunities with both my current home and future secondary properties. These personal experiences give me deep empathy for the transitions, questions, and opportunities that come with each stage of homeownership.
                    </p>
                </div>

                <div className='About-section About-section-odd'>

                    <p className='About-title'>

                        What Sets Me Apart
                    </p>
                    <p className='About-content'>

                        I’m a former professor, so education is at the heart of everything I do.

                        I work one-on-one with every client—no passing you off to assistants or call centers.

                        I take a calm, non-salesy approach focused on your long-term financial well-being.
                    </p>
                </div>
                <div className='About-section About-section-even'>

                    <p className='About-title'>

                        What You Can Expect
                    </p>

                    <p className='About-content'>

                        Clear explanations without the jargon

                        Personalized mortgage solutions tailored to your life

                        A trustworthy guide from start to finish
                    </p>
                </div>
                <div className='About-section About-section-odd'>

                    <p className='About-title'>

                        My Philosophy & Promise
                    </p>
                    <p className='About-content'>

                        Homeownership is one of the most meaningful financial and emotional milestones a person can reach. I believe it should be accessible, understandable, and empowering—not intimidating or overwhelming.

                        I promise to:

                        Treat every client with care, honesty, and respect

                        Provide patient, jargon-free education every step of the way

                        Focus on what’s best for your long-term goals—not just a quick transaction

                        Be your steady guide from first conversation to closing and beyond
                    </p>
                </div>
                <div className='About-section About-section-even'>
                    <p className='About-title'>

                        Let’s Talk
                    </p>
                    <p className='About-content'>

                        Whether you're navigating this process for the first time or the fifth, I’ll meet you where you are and help you move forward with clarity and confidence.
                    </p>

                    <p className='About-content'>

                        If you’re ready to stop feeling confused and start feeling confident, I’d love to help. Book a free consultation and let’s take the next step together.
                    </p>
                </div>
            </div>
        </main>
    );
}

export default About;
