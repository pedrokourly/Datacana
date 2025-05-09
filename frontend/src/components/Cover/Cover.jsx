// Import Style Component
import './Cover.css';
import 'animate.css'

const Cover = ({pageName}) => {
    return (
        <>
            <div className="Cover">
                <div className="title">
                    <h1>{pageName}</h1>
                    <div className="container rule"></div>
                </div>
            </div>
        </>
    );
};

export default Cover;