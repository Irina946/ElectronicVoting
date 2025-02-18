import FooterImg from "../../assets/footer.svg"


export const Footer = () => {
    return (
        <div className="flex flex-col justify-center items-center w-[100%] bg-(--color-footer)">
            <img src={FooterImg} alt="Footer" />
        </div>
    );
};