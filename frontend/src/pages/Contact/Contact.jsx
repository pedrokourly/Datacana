// Import Style Page Module
import './Contact.css';

// Import Components
import Cover from '../../components/Cover/Cover.jsx';

const Contact = () => {
    return (
        <div className="Contact">
            <Cover pageName="Contato"/>

            <div className="content">
                <div className="container">
                    <article>
                        <p>Quaisquer dúvidas na utilização dos dados fornecidos pelo DataCana devem ser enviadas para o e-mail:</p>
                        <p><a href="mailto:datacana.ufu@gmail.com">datacana.ufu@gmail.com</a></p>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default Contact;