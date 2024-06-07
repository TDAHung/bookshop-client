// About.js
import { useEffect, useState } from "react";

const About = () => {
    const [about, setAbout] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/about/synchronize')
            .then(response => {
                return response.text();
            })
            .then(html => {
                setAbout(html)
            })
            .catch(error => console.log(error))
    }, []);

    return <div dangerouslySetInnerHTML={{ __html: about }} />
}

export default About;
