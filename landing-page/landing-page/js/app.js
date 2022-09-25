// Giving Name for Elements in Css
const list = document.getElementById('navbar__list');
const sections = document.querySelectorAll('section');
const fragment = new DocumentFragment();
// Started Building Navigator Bar for it to automatically put new sections if found
function buildNavigatorBar()
{
  sections.forEach((section) =>
  {
    const listItem = document.createElement('li');
    const ItemLink = document.createElement('a');
    ItemLink.classList.add('menu__link');
    ItemLink.href = `#${section.id}`;
    ItemLink.textContent = section.dataset.nav;
    ItemLink.addEventListener('click', evt =>
    {
      evt.preventDefault();
      // giving characterestics when scrolling            
      section.scrollIntoView(
      {
        behavior: 'smooth',
      });
    });
    listItem.appendChild(ItemLink);
    fragment.appendChild(listItem);
  });
  list.appendChild(fragment);
}
// adjusting active section automatically when scrolling 
document.addEventListener('DOMContentLoaded', buildNavigatorBar);

function addHighlighting()
{
  sections.forEach(section =>
  {
    const TopSection = section.getBoundingClientRect().top;
    const activer = document.querySelector(`a[href="#${section.id}"]`)
    if(TopSection >= -400 && TopSection <= 150)
    {
      //Adding the ClassList (Active) if met by requirments
      section.classList.add('your-active-class');
      activer.classList.add('active-link');
    }
    else
    {
      //Removing the ClassList (Active) if didn't meet the requirments
      section.classList.remove('your-active-class');
      activer.classList.remove('active-link');
    }
  });
}
window.addEventListener('scroll', addHighlighting);