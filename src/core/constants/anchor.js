import { AnchorProvider, Program} from "@coral-xyz/anchor";
import CoinkickIdl from "./idl/coinkick.json";
import { SOLANA_COINKICK_PROGRAMID } from "./address";

export function getAnchorProgram(
    connection,
    wallet,
    confirmOptions,
) {
    const provider = new AnchorProvider(connection, wallet, confirmOptions ?? { commitment: "confirmed"});
    const program = new Program(CoinkickIdl, SOLANA_COINKICK_PROGRAMID, provider);
    return program;
}