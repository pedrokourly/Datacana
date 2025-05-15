// Import Style Page Module
import './Products.css';

// Import Components
import Cover from '../../../components/Cover/Cover';

const Products = () => {
    return (
        <div className="Products">
            <Cover pageName="Produtos"/>

            <div className="content">
                <div className="container">
                    <article>
                        <h2>Sobre os Produtos DataCana</h2>

                        <p>São vários os produtos que os usuários da plataforma podem consultar e realizar o <i>download</i> para os municípios, regiões imediatas e intermediárias de Minas Gerais, acerca da produção canavieira:</p>

                        <h3>Mapas Temáticos</h3>
                        <h3>Gráficos</h3>
                        <h3>Tabelas</h3>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default Products;