import {Link} from 'react-router-dom'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import saleCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import Slider from '../components/Slider'

function Explore() {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Buscar</p>
      </header>
      <main>
        <Slider />
        <p className="exploreCategoryHeading">Categorias</p>
        <div className="exploreCategories">
          <Link to ='/category/rent'>
            <img src={rentCategoryImage} alt="Arriendo" className="exploreCategoryImg" />
            <p className="exploreCategoryName">Arriendo</p>
          </Link>
          <Link to ='/category/sell'>
            <img src={saleCategoryImage} alt="Venta" className="exploreCategoryImg" />
            <p className="exploreCategoryName">Venta</p>
          </Link>
        </div>
      </main>
    </div>

  )
}

export default Explore
