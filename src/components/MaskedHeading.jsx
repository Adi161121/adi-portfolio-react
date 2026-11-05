import "../styles/MaskedHeading.css";

export function MaskedHeading() {
  return (
    <span className="masked-heading" aria-hidden="true">
      <span className="masked-heading__word">ADITYA</span>
      <span className="masked-heading__word">SAKPAL</span>
    </span>
  );
}
