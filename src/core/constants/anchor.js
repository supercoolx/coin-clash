import { AnchorProvider, Program} from "@coral-xyz/anchor";
import MemetroBondingIdl from "./idl/memetro_bonding.json";
import { SOLANA_MEMETRO_BONDING_PROGRAMID } from "./address";

export function getAnchorProgram(
    connection,
    wallet,
    confirmOptions,
) {
    const provider = new AnchorProvider(connection, wallet, confirmOptions ?? { commitment: "confirmed"});
    const program = new Program(MemetroBondingIdl, SOLANA_MEMETRO_BONDING_PROGRAMID, provider);
    return program;
}