use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    clock::Clock,
    sysvar::Sysvar,
};

// Define the program entrypoint
entrypoint!(process_instruction);

// Certificate data structure
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Certificate {
    pub student_name: String,
    pub course_name: String,
    pub issue_date: i64,
    pub issuer: Pubkey,
    pub certificate_id: String,
    pub grade: String,
    pub is_revoked: bool,
}

// Instruction enum
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum CertificateInstruction {
    /// Issue a new certificate
    /// Accounts expected:
    /// 0. `[signer]` The issuer account
    /// 1. `[writable]` The certificate account to create
    IssueCertificate {
        student_name: String,
        course_name: String,
        certificate_id: String,
        grade: String,
    },
    /// Verify a certificate
    /// Accounts expected:
    /// 0. `[]` The certificate account
    VerifyCertificate,
    /// Revoke a certificate
    /// Accounts expected:
    /// 0. `[signer]` The issuer account
    /// 1. `[writable]` The certificate account
    RevokeCertificate,
}

// Program entrypoint implementation
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = CertificateInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    match instruction {
        CertificateInstruction::IssueCertificate {
            student_name,
            course_name,
            certificate_id,
            grade,
        } => {
            msg!("Instruction: Issue Certificate");
            issue_certificate(
                program_id,
                accounts,
                student_name,
                course_name,
                certificate_id,
                grade,
            )
        }
        CertificateInstruction::VerifyCertificate => {
            msg!("Instruction: Verify Certificate");
            verify_certificate(accounts)
        }
        CertificateInstruction::RevokeCertificate => {
            msg!("Instruction: Revoke Certificate");
            revoke_certificate(program_id, accounts)
        }
    }
}

// Issue a new certificate
fn issue_certificate(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    student_name: String,
    course_name: String,
    certificate_id: String,
    grade: String,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let issuer_account = next_account_info(accounts_iter)?;
    let certificate_account = next_account_info(accounts_iter)?;

    // Verify that the issuer is a signer
    if !issuer_account.is_signer {
        msg!("Issuer must be a signer");
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Verify that the certificate account is owned by this program
    if certificate_account.owner != program_id {
        msg!("Certificate account must be owned by this program");
        return Err(ProgramError::IncorrectProgramId);
    }

    // Get current timestamp
    let clock = Clock::get()?;
    let current_time = clock.unix_timestamp;

    // Create the certificate
    let certificate = Certificate {
        student_name,
        course_name,
        issue_date: current_time,
        issuer: *issuer_account.key,
        certificate_id,
        grade,
        is_revoked: false,
    };

    // Serialize and save the certificate data
    certificate.serialize(&mut &mut certificate_account.data.borrow_mut()[..])?;

    msg!("Certificate issued successfully");
    Ok(())
}

// Verify a certificate
fn verify_certificate(accounts: &[AccountInfo]) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let certificate_account = next_account_info(accounts_iter)?;

    // Deserialize the certificate data
    let certificate = Certificate::try_from_slice(&certificate_account.data.borrow())?;

    msg!("Certificate Verification:");
    msg!("Student Name: {}", certificate.student_name);
    msg!("Course Name: {}", certificate.course_name);
    msg!("Certificate ID: {}", certificate.certificate_id);
    msg!("Grade: {}", certificate.grade);
    msg!("Issue Date: {}", certificate.issue_date);
    msg!("Issuer: {}", certificate.issuer);
    msg!("Is Revoked: {}", certificate.is_revoked);

    if certificate.is_revoked {
        msg!("WARNING: This certificate has been revoked!");
        return Err(ProgramError::Custom(1));
    }

    msg!("Certificate is valid!");
    Ok(())
}

// Revoke a certificate
fn revoke_certificate(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let issuer_account = next_account_info(accounts_iter)?;
    let certificate_account = next_account_info(accounts_iter)?;

    // Verify that the issuer is a signer
    if !issuer_account.is_signer {
        msg!("Issuer must be a signer");
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Verify that the certificate account is owned by this program
    if certificate_account.owner != program_id {
        msg!("Certificate account must be owned by this program");
        return Err(ProgramError::IncorrectProgramId);
    }

    // Deserialize the certificate data
    let mut certificate = Certificate::try_from_slice(&certificate_account.data.borrow())?;

    // Verify that the signer is the original issuer
    if certificate.issuer != *issuer_account.key {
        msg!("Only the original issuer can revoke the certificate");
        return Err(ProgramError::Custom(2));
    }

    // Mark the certificate as revoked
    certificate.is_revoked = true;

    // Save the updated certificate
    certificate.serialize(&mut &mut certificate_account.data.borrow_mut()[..])?;

    msg!("Certificate revoked successfully");
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use solana_program::clock::Epoch;
    use std::mem;

    #[test]
    fn test_certificate_serialization() {
        let certificate = Certificate {
            student_name: "John Doe".to_string(),
            course_name: "Blockchain Development".to_string(),
            issue_date: 1234567890,
            issuer: Pubkey::new_unique(),
            certificate_id: "CERT-001".to_string(),
            grade: "A+".to_string(),
            is_revoked: false,
        };

        let mut buffer = vec![0u8; 1000];
        certificate.serialize(&mut buffer.as_mut_slice()).unwrap();
        let deserialized = Certificate::try_from_slice(&buffer).unwrap();

        assert_eq!(certificate.student_name, deserialized.student_name);
        assert_eq!(certificate.course_name, deserialized.course_name);
        assert_eq!(certificate.certificate_id, deserialized.certificate_id);
    }
}
