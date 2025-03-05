export abstract class Comparer {
  abstract compare(plain: string, hash: string): Promise<boolean>
}
