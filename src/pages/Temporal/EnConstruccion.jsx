import './EnConstruccion.css';

export const EnConstruccion = () => {
    return (
        <main className="construccion">
            <section className="construccion__container">
                <h1 className="construccion__title">🚧 Página en Construcción</h1>
                <p className="construccion__message">
                    Estamos trabajando para traerte esta funcionalidad pronto.
                </p>
                <button
                    className="construccion__button"
                    onClick={() => window.location.href = '/solicitud'}
                >
                    Volver al inicio
                </button>
            </section>
        </main>
    );
};
