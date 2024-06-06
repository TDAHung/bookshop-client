import MostOrderBook from "./MostOrderBooks";
import PopularBook from "./PopularBooks";
import PromotionBook from "./PromotionBooks";

const Home = () => {
    return (
        <div>
            <PopularBook />
            <MostOrderBook />
            <PromotionBook />
        </div>
    )
}

export default Home;
