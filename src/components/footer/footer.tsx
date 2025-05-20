import FooterImg from "../../assets/footer.svg"

// Константа для размера изображения в футере
const FOOTER_MAX_HEIGHT = 400;

export const Footer = () => {
    return (
        <div 
            className="flex flex-col justify-center items-center w-[100%] bg-(--color-footer)"
            style={{ maxHeight: `${FOOTER_MAX_HEIGHT}px` }}
        >
            <img 
                src={FooterImg} 
                alt="Footer" 
                style={{ maxHeight: `${FOOTER_MAX_HEIGHT}px` }}
            />
        </div>
    );
};