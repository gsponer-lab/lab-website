"""Turn a two-chain complex (a target and a designed binder) into the cartoon data the home-page viewer draws.

    ~/Desktop/protein-design-interactive-slides/.venv/bin/python tools/prep_complex.py 7jzu.cif js/complex-data.js \
        --target B --binder A

Source structure: PDB 7JZU, SARS-CoV-2 spike RBD (chain B) bound to the de novo mini-protein binder LCB1
(chain A); Cao et al., Science 370, 426 (2020). Download: https://files.rcsb.org/download/7JZU.cif

Writes js/complex-data.js, which sets window.COMPLEX = {target, binder}. Each chain has, per residue, the Cα
position (Å), the secondary structure (H helix, E strand, C other) and the carbonyl direction in the Cα frame,
which is what js/cartoon.js needs. Both chains share one frame (centred on the complex, longest axis along x),
so the binder stays where it sits on the target. Adapted from tools/prep_protein.py in the template repo
protein-design-interactive-slides (MIT).
"""

import argparse
import json
from pathlib import Path

import gemmi
import numpy as np


def ca_frame(ca, i):
    i = min(max(i, 1), len(ca) - 2)
    t = ca[i + 1] - ca[i - 1]
    t /= np.linalg.norm(t)
    b = 2 * ca[i] - ca[i - 1] - ca[i + 1]
    b -= t * (t @ b)
    b /= np.linalg.norm(b)
    return t, b, np.cross(t, b)


def dssp(residues):
    try:
        import mdtraj
    except ImportError:
        return None
    import tempfile
    st = gemmi.Structure()
    model = gemmi.Model("1")
    chain = gemmi.Chain("A")
    for r in residues:
        chain.add_residue(r)
    model.add_chain(chain)
    st.add_model(model)
    st.setup_entities()
    with tempfile.NamedTemporaryFile(suffix=".pdb") as f:
        st.write_pdb(f.name)
        ss = mdtraj.compute_dssp(mdtraj.load(f.name), simplified=True)[0]
    return ["C" if c not in "HE" else c for c in ss]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("structure", type=Path)
    ap.add_argument("out", type=Path)
    ap.add_argument("--target", required=True)
    ap.add_argument("--binder", required=True)
    args = ap.parse_args()

    st = gemmi.read_structure(str(args.structure))
    st.setup_entities()
    st.remove_hydrogens()
    st.remove_alternative_conformations()
    model = st[0]
    is_protein = lambda r: r.entity_type == gemmi.EntityType.Polymer and r.find_atom("CA", "*") \
        and r.find_atom("C", "*") and r.find_atom("O", "*")
    pos = lambda r, name: np.array(r.find_atom(name, "*").pos.tolist())

    chains = {}
    for role, name in (("target", args.target), ("binder", args.binder)):
        residues = [r for r in model[name] if is_protein(r)]
        chains[role] = (name, residues)

    all_ca = np.array([pos(r, "CA") for _, rs in chains.values() for r in rs])
    centre = all_ca.mean(0)
    _, _, vt = np.linalg.svd(all_ca - centre)
    x, z = vt[0], vt[1]
    rot = np.array([x, np.cross(z, x), z])

    out = {}
    for role, (name, residues) in chains.items():
        ca = (np.array([pos(r, "CA") for r in residues]) - centre) @ rot.T
        index = {r.seqid.num: k for k, r in enumerate(residues)}
        ss = ["C"] * len(residues)

        def mark(start, end, code):
            if start.chain_name != name:
                return
            for num in range(start.res_id.seqid.num, end.res_id.seqid.num + 1):
                if num in index:
                    ss[index[num]] = code

        for helix in st.helices:
            mark(helix.start, helix.end, "H")
        for sheet in st.sheets:
            for strand in sheet.strands:
                mark(strand.start, strand.end, "E")
        if set(ss) == {"C"}:
            found = dssp(residues)
            if found is None:
                print(f"{role}: no helix/sheet records and no mdtraj: drawing as coil")
            else:
                ss = found
        coeffs = []
        for k, r in enumerate(residues):
            d = (pos(r, "O") - pos(r, "C")) @ rot.T
            d /= np.linalg.norm(d)
            t, b, n = ca_frame(ca, k)
            coeffs.append([round(float(d @ t), 4), round(float(d @ b), 4), round(float(d @ n), 4)])
        s = "".join(ss)
        print(f"{role} (chain {name}): {len(ca)} residues, {s.count('H')} helix, {s.count('E')} strand, {s.count('C')} other")
        out[role] = {"chain": name, "ca": np.round(ca, 3).tolist(), "ss": s, "dir": coeffs}

    out["radius"] = round(float(np.linalg.norm(np.concatenate([np.array(v["ca"]) for v in out.values()]), axis=1).max()), 2)
    args.out.write_text(f"window.COMPLEX = {json.dumps(out)};\n")


if __name__ == "__main__":
    main()
