
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cardCases.scss";
import CustomCard from "../../pricesComponents/customCard/customCard";
import caseStudies from "../../../components/userCasesComponents/caseStudiesData";
import SearchBar from "../searchBar/searchBar"; // Importamos la barra de búsqueda

const ITEMS_PER_PAGE = 9; // 📌 Número de tarjetas por página

const CardCases = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all"); // Estado inicial en "all"
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    // 📌 Filtrar casos según la búsqueda y la categoría seleccionada
    const normalizeText = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const filteredCases = caseStudies.filter(study => {
        const searchLower = normalizeText(searchQuery);
        const categoryLower = normalizeText(selectedCategory);

        // 🔍 Coincidencia con la búsqueda
        const matchesSearch = searchQuery
            ?   (study.category && normalizeText(study.category).includes(searchLower)) ||
                (study.keywords && study.keywords.some(keyword => normalizeText(keyword).includes(searchLower))) ||
                (study.description && normalizeText(study.description).includes(searchLower)) // 🔥 Ahora busca en la descripción sin tildes
        : true;

        // 📌 Coincidencia con la categoría seleccionada
        const matchesCategory = categoryLower === "all" || 
            (study.category && normalizeText(study.category) === categoryLower);

        return matchesSearch && matchesCategory;
    });

    // 📌 Calcular el número total de páginas basado en los resultados filtrados
    const totalPages = Math.ceil(filteredCases.length / ITEMS_PER_PAGE);

    // 📌 Obtener los elementos de la página actual
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredCases.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <SearchBar 
                onSearch={setSearchQuery} 
                onCategorySelect={setSelectedCategory} 
                selectedCategory={selectedCategory} 
            />
            <div className="card-cases-wrapper d-flex flex-column">
                {/* 📌 Renderizar los elementos paginados */}
                <div className="d-flex justify-content-center gap-5 flex-wrap clickable-card">
                    {currentItems.length > 0 ? (
                        currentItems.map(study => (
                            <CustomCard
                                key={study.id}
                                imageUrl={study.imageUrl}
                                title={study.title}
                                price="" // No se usa en este caso
                                features={[study.description]}
                                buttonText="Read More"
                                onButtonClick={() => {
                                    navigate(`/case-study/${study.id}`, { state: study });
                                }}
                                className="card-component-cases col-10 col-md-5 col-lg-4"
                                featuresAsList={false} // Para que se renderice como texto normal
                            />
                        ))
                    ) : (
                        <p>No se encontraron coincidencias.</p>
                    )}
                </div>

                {/* 📌 Paginación numérica */}
                {totalPages > 1 && (
                    <div className="pagination mt-4">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}
                                onClick={() => {
                                    setCurrentPage(index + 1);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>         
        </>
    );
};

export default CardCases;
